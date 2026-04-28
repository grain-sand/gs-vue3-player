<template>
  <!--suppress HtmlUnknownAttribute -->
  <video
      ref="videoRef"
      :autoplay="props.autoplay"
      :controls="props.controls"
      :muted="props.muted"
      :volume="props.volume"
      @volumechange="volumeChange"
      @ratechange="rateChange"
      @error="error = videoRef.error"
      @play="playing = true"
      @pause="playing = false"
      @timeupdate="time = videoRef?.currentTime || 0"
      @loadedmetadata="loadedmetadata"
      @ended="handleEnded"
  ></video>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, shallowRef, watch} from 'vue';
import Hls from 'hls.js';
import {
  DefaultHlsConfig,
  IPlayerCoreEmits,
  IPlayerCoreExpose,
  IPlayerCoreProps,
  IVideoQuality,
  PlaySource,
  PlaybackMode
} from '../type';
import {
  findClosestHlsLevel,
  findClosestQuality,
  getStringSource,
  parseVideoSource,
  selectSmallerQuality,
  switchHlsQuality
} from "../util";
import {SourceWrapper} from './SourceWrapper';
import {PlaylistManager} from './PlaylistManager';

const props = defineProps<IPlayerCoreProps>();

const emit = defineEmits<IPlayerCoreEmits>();

const videoRef = ref<HTMLVideoElement>();
const hls = shallowRef<Hls>();
const muted = ref(false);
const volume = ref(0);
const rate = ref(1);
const error = ref<MediaError>()
const playing = ref(false)
const duration = ref(0)
const time = ref(0)
const innerSrc = ref<PlaySource>()
const currentMode = ref<PlaybackMode>(props.mode || 'sequence')
const bestQuality = ref<Partial<IVideoQuality>>()

const playlistManager = new PlaylistManager({
  onSrcChange: (src) => {
    // @ts-ignore
    emit('srcChange', src)
  },
  onSrcRemove: (src) => {
    // @ts-ignore
    emit('srcRemove', src)
  }
});

let isFirstLoadedmetadata = true;

watch(
    () => [...(props.playlist ?? [])],
    (list) => {
      playlistManager.updatePlaylist(list);
    },
    {immediate: true})

onMounted(() => {
  if (videoRef.value) {
    muted.value = videoRef.value.muted
    volume.value = videoRef.value.volume
  }
  if (props.src) {
    setSrc(props.src);
  } else if (playlistManager.getPlaylist().length) {
    setSrc(playlistManager.getPlaylist()[0]);
  }
})

function loadedmetadata() {
  duration.value = videoRef.value.duration
  if (innerSrc.value) {
    (innerSrc.value as any).duration = duration.value
  }
  if (isFirstLoadedmetadata) {
    isFirstLoadedmetadata = false;
    watch(() => props.rate, (r = 1.0) => {
      videoRef.value.playbackRate = r
    }, {immediate: true})
  }
}

function rateChange() {
  const old = rate.value;
  rate.value = videoRef.value?.playbackRate || 1
  if (rate.value !== old) {
    // @ts-ignore
    emit('rateChange', rate.value)
  }
}

function volumeChange() {
  if (muted.value !== videoRef.value?.muted) {
    muted.value = videoRef.value?.muted || false
    // @ts-ignore
    emit('mutedChange', muted.value)
  }
  if (volume.value !== videoRef.value?.volume) {
    volume.value = videoRef.value?.volume || 0
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

function setSrc(src: PlaySource | undefined) {
  if (innerSrc.value === src) {
    return;
  }
  innerSrc.value = src;
  playlistManager.setCurrentSrc(src);

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
  const parseSrc = src instanceof SourceWrapper ? src._raw : src;
  const {type, src: typedSrc, poster = ''} = parseVideoSource(parseSrc);
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
      newHls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (bestQuality.value) {
          adjustHlsQuality();
        }
      });
      newHls.on(Hls.Events.LEVEL_SWITCHED, () => {
        if (bestQuality.value) {
          adjustHlsQuality();
        }
      });
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

watch(() => props.src, (newSrc) => {
  if (newSrc) {
    setSrc(newSrc);
  }
});

watch(() => props.mode, (newMode) => {
  if (newMode) {
    currentMode.value = newMode;
    playlistManager.currentMode = newMode;
    // @ts-ignore
    emit('modeChange', newMode);
  }
});

onBeforeUnmount(() => {
  destroyHls();
  playlistManager.clear();
});

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

function catchError(e: Error) {
  if (e.name !== 'AbortError') {
    console.log(e)
  }
}

async function doPlay() {
  const {value: el} = videoRef;
  try {
    el.autoplay = true
    el.playsInline = true
    el.muted = false
    await el?.play()
  } catch (e) {
    if (e.name === 'AbortError') {
      return
    }
    el.muted = true
    await el?.play().catch(catchError)
    el.muted = false
  }
}

function toBestQuality(reference: Partial<IVideoQuality>, now: boolean = false) {
  if (!reference.width && !reference.height) {
    return;
  }

  bestQuality.value = reference;

  const video = videoRef.value;
  if (!video) return;

  const {value: currentSrc} = innerSrc;
  if (!currentSrc) return;

  const parseSrc = currentSrc instanceof SourceWrapper ? currentSrc._raw : currentSrc;
  const {type, src: typedSrc} = parseVideoSource(parseSrc);

  if (type === 'hls' && hls.value) {
    adjustHlsQuality(now);
  } else if (Array.isArray(typedSrc)) {
    let bestQualityByWidth = null;
    let bestQualityByHeight = null;

    if (reference.width) {
      bestQualityByWidth = findClosestQuality(typedSrc, reference.width, 'width');
    }

    if (reference.height) {
      bestQualityByHeight = findClosestQuality(typedSrc, reference.height, 'height');
    }

    const selectedQuality = selectSmallerQuality(bestQualityByWidth, bestQualityByHeight);

    if (selectedQuality) {
      const currentTime = video.currentTime;
      const currentUrl = video.currentSrc;
      if (selectedQuality.url !== currentUrl) {
        video.src = selectedQuality.url;
        video.currentTime = currentTime;
        video.play().catch(catchError);
      }
    }
  }
}

function adjustHlsQuality(now: boolean = false) {
  if (!hls.value || !bestQuality.value) return;

  const reference = bestQuality.value;
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
}

async function changeSourceAndPlay(src: PlaySource | undefined) {
  if (src && videoRef.value) {
    setSrc(src);
    await doPlay();
  } else {
    setSrc(src);
  }
}

const handleEnded = () => {
  const el = videoRef.value;
  const wasMuted = el?.muted;

  const result = playlistManager.handleEnded(props.nextSrc);

  switch (result.action) {
    case 'play':
      el?.play().catch(console.log);
      break;
    case 'pause':
      el?.pause();
      break;
    case 'change':
      changeSourceAndPlay(result.src);
      break;
  }

  if (el) {
    el.muted = wasMuted;
  }
};

const playPre = async () => {
  const source = playlistManager.navTo(props.preSrc, -1, props.preSrc, props.nextSrc);
  await changeSourceAndPlay(source);
}

const playNext = async () => {
  const source = playlistManager.navTo(props.nextSrc, 1, props.preSrc, props.nextSrc);
  await changeSourceAndPlay(source);
}

defineExpose<IPlayerCoreExpose>({
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
  get mode() {
    return currentMode.value
  },
  set mode(v) {
    currentMode.value = v;
    playlistManager.currentMode = v;
    // @ts-ignore
    emit('modeChange', v);
  },
  get playlist() {
    return playlistManager.getPlaylist()
  },
  get index() {
    return playlistManager.getIndex()
  },
  get nextSrc() {
    return playlistManager.getNextSrc(props.nextSrc)
  },
  get preSrc() {
    return playlistManager.getPreSrc(props.preSrc)
  },
  async togglePlay() {
    const {value: el} = videoRef;
    if (el.paused) {
      await doPlay()
    } else {
      await el.pause()
    }
  },
  async play(src?: PlaySource) {
    if (!src) {
      await doPlay()
      return;
    }
    setSrc(src);
    await doPlay()
  },
  setSrc,
  async pause() {
    await videoRef.value?.pause()
  },
  async unmute() {
    videoRef.value.muted = false
  },
  toBestQuality,
  autoQualityHls() {
    bestQuality.value = undefined;
    if (hls.value) {
      hls.value.nextLevel = -1;
    }
  },
  get bestQuality() {
    return bestQuality.value;
  },
  playPre,
  playNext
})
</script>
