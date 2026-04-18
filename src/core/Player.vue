<template>
  <!--suppress HtmlUnknownAttribute -->
  <video
      ref="videoRef"
      :autoplay="autoplay"
      :controls="controls"
      :muted="props.muted"
      :volume="props.volume"
      @volumechange="volumeChange"
      @ratechange="rateChange"
      @error="error = videoRef.error"
      @play="playing = true"
      @pause="playing = false"
      @timeupdate="time = videoRef.currentTime"
      @loadedmetadata="loadedmetadata"
  ></video>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, shallowRef, watch} from 'vue';
import Hls from 'hls.js';
import {DefaultHlsConfig, IPlayerEmits, IPlayerExpose, IPlayerProps, IVideoQuality, PlayerSource} from '../types';
import {
  findClosestHlsLevel,
  findClosestQuality,
  getStringSource,
  parseVideoSource,
  selectSmallerQuality,
  switchHlsQuality
} from "../util";

const props = defineProps<IPlayerProps>();

// Emits
const emit = defineEmits<IPlayerEmits>();

const videoRef = ref<HTMLVideoElement>();
const hls = shallowRef<Hls>();
const muted = ref(false);
const volume = ref(0);
const rate = ref(1);
const error = ref<MediaError>()
const playing = ref(false)
const duration = ref(0)
const time = ref(0)
const innerSrc = ref<PlayerSource>()

let isFirstLoadedmetadata = true;


onMounted(() => {
  if (videoRef.value) {
    muted.value = videoRef.value.muted
    volume.value = videoRef.value.volume
  }
  setSrc(props.src)
})

function loadedmetadata() {
  duration.value = videoRef.value.duration
  if (isFirstLoadedmetadata) {
    isFirstLoadedmetadata = false;
    watch(() => props.rate, (r = 1.0) => {
      videoRef.value.playbackRate = r
    }, {immediate: true})
  }
}

function rateChange() {
  const old = rate.value;
  rate.value = videoRef.value?.playbackRate
  if (rate.value !== old) {
    // @ts-ignore
    emit('rateChange', rate.value)
  }
}

function volumeChange() {
  if (muted.value !== videoRef.value?.muted) {
    muted.value = videoRef.value?.muted
    // @ts-ignore
    emit('mutedChange', muted.value)
  }
  if (volume.value !== videoRef.value?.volume) {
    volume.value = videoRef.value?.volume
    // @ts-ignore
    emit('volumeChange', volume.value)
  }
}


const destroyHls = () => {
  if (hls.value) {
    hls.value.detachMedia()
    hls.value.destroy();
    hls.value = undefined;
  }
};

function getQuality() {
  if (props.quality?.width) {
    return props.quality.width;
  }
  return videoRef.value?.getBoundingClientRect()?.width || 320;
}

// 初始化播放器逻辑
function setSrc(src: PlayerSource) {
  if (innerSrc.value === src) {
    return;
  }
  innerSrc.value = src;

  // @ts-ignore
  setTimeout(() => emit('srcChange', src as any), 10);
  destroyHls();
  const video = videoRef.value;
  if (!video) {
    return;
  }
  if (!src) {
    video.removeAttribute('poster')
    video.removeAttribute('src')
    video.load()
    return;
  }

  const autoplay = video.autoplay;
  const {type, src: typedSrc, poster = ''} = parseVideoSource(src);
  const srcStr = getStringSource(typedSrc, getQuality());
  video.poster = poster
  const hlsSupped = Hls.isSupported();
  if (type === 'hls') {
    if (props.useBrowserHls && !hlsSupped && video?.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = srcStr;
    } else if (hlsSupped) {
      const newHls = new Hls({...DefaultHlsConfig, ...props.hlsConfig});
      newHls.loadSource(srcStr);
      newHls.attachMedia(video);
      hls.value = newHls;
    } else {
      throw new Error('Browser not supported hls')
    }
  } else {
    video.src = srcStr;
  }
  video.poster = poster
  video.autoplay = autoplay
  video.playbackRate = rate.value;
}

watch(() => props.src, setSrc);

onBeforeUnmount(destroyHls);

function setVolume(volume: number) {
  const {value: el} = videoRef;
  if (el) {
    el.volume = volume;
    if (volume > 0) try {
      el.muted = false;
    } catch {
    }
  }
}

async function play() {
  const {value: el} = videoRef;
  try {
    el.autoplay = true
    el.playsInline = true
    el.muted = false
    await el?.play()
  } catch {
    el.muted = true
    await el?.play()
    el.muted = false
  }
}

function toBestQuality(reference: IVideoQuality, now: boolean = false) {
  // 检查参考尺寸是否存在
  if (!reference.width && !reference.height) {
    return;
  }

  const video = videoRef.value;
  if (!video) return;

  // 获取当前播放源
  const {value: currentSrc} = innerSrc;
  if (!currentSrc) return;

  const {type, src: typedSrc} = parseVideoSource(currentSrc);

  if (type === 'hls' && hls.value) {
    // HLS 质量切换
    let bestLevel = -1;

    if (reference.width) {
      const widthLevel = findClosestHlsLevel(hls.value, reference.width, 'width');
      if (widthLevel !== -1) {
        bestLevel = widthLevel;
      }
    }

    if (reference.height) {
      const heightLevel = findClosestHlsLevel(hls.value, reference.height, 'height');
      if (heightLevel !== -1) {
        if (bestLevel === -1) {
          bestLevel = heightLevel;
        } else {
          // 从两个结果中选择较小的质量
          const widthLevelInfo = hls.value.levels[bestLevel];
          const heightLevelInfo = hls.value.levels[heightLevel];

          if (widthLevelInfo && heightLevelInfo) {
            const widthArea = widthLevelInfo.width * (widthLevelInfo.height || widthLevelInfo.width);
            const heightArea = heightLevelInfo.width * (heightLevelInfo.height || heightLevelInfo.width);

            if (heightArea < widthArea) {
              bestLevel = heightLevel;
            }
          }
        }
      }
    }

    if (bestLevel !== -1) {
      switchHlsQuality(hls.value, bestLevel, now);
    }
  } else if (Array.isArray(typedSrc)) {
    // 非 HLS 质量切换（使用质量列表）
    let bestQualityByWidth = null;
    let bestQualityByHeight = null;

    if (reference.width) {
      bestQualityByWidth = findClosestQuality(typedSrc, reference.width, 'width');
    }

    if (reference.height) {
      bestQualityByHeight = findClosestQuality(typedSrc, reference.height, 'height');
    }

    const bestQuality = selectSmallerQuality(bestQualityByWidth, bestQualityByHeight);

    if (bestQuality) {
      // 保持当前播放时间
      const currentTime = video.currentTime;

      // 检查是否与当前URL一致
      const currentUrl = video.currentSrc;
      if (bestQuality.url !== currentUrl) {
        // 重新加载URL
        video.src = bestQuality.url;
        video.currentTime = currentTime;
        video.play();
      }
    }
  }
}

defineExpose<IPlayerExpose>({
  get el() {
    return videoRef.value
  },
  get volume() {
    return volume.value
  },
  set volume(v) {
    setVolume(v)
  },
  get muted() {
    return muted.value
  },
  set muted(v) {
    videoRef.value.muted = v
  },
  get time() {
    return time.value
  },
  set time(v) {
    videoRef.value.currentTime = v;
  },
  get duration() {
    return duration.value
  },
  set rate(v) {
    videoRef.value.playbackRate = v
  },
  get rate() {
    return rate.value
  },
  get playing() {
    return playing.value
  },
  get error() {
    return error.value;
  },
  get src() {
    return innerSrc.value
  },
  set src(v) {
    setSrc(v)
  },
  async togglePlay() {
    const {value: el} = videoRef;
    if (el.paused) {
      await play()
    } else {
      await el.pause()
    }
  },
  async play(src?: PlayerSource) {
    if (!src) {
      await play()
      return;
    }
    setSrc(src);
    await play()
  },
  setSrc,
  setVolume,
  async pause() {
    await videoRef.value?.pause()
  },
  async unmute() {
    videoRef.value.muted = false
  },
  toBestQuality,
  autoQualityHls() {
    if (hls.value) {
      hls.value.nextLevel = -1;
    }
  }
})

</script>
