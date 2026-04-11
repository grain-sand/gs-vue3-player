<template>
  <video ref="videoRef" v-bind="$attrs"></video>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, shallowRef, watch} from 'vue';
import Hls, {HlsConfig} from 'hls.js';
import type {IPlayerExpose, IPlayerProps} from '../types';
import {PlayerSource} from "../types";
import {getStringSource, parseVideoSource} from "../util";

const defaultHlsConfig: Partial<HlsConfig> = Object.freeze({
  maxBufferLength: 1,        // 几乎不缓冲未来
  maxMaxBufferLength: 2,
  maxBufferBackLength: 0,    // 不保留已播内容
  lowLatencyMode: false,      // 关闭低延迟（低延迟会多预载）
  autoStartLoad: true,
  maxLoadingDelay: 0.1,
  minBufferLength: 1,
  startLevel: -1,
})

defineOptions({
  name: 'PureVideoPlayer',
  inheritAttrs: false // 禁用默认继承，手动让 video 标签接管
});

const props = defineProps<IPlayerProps>();

const videoRef = ref<HTMLVideoElement>();
const hlsInstance = shallowRef<Hls>();

const destroyHls = () => {
  if (hlsInstance.value) {
    hlsInstance.value.destroy();
    hlsInstance.value = undefined;
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
  if (!src || !videoRef.value) {
    return;
  }
  destroyHls();

  const video = videoRef.value;
  const {type, src: typedSrc, poster, title} = parseVideoSource(src);
  const srcStr = getStringSource(typedSrc, getQuality());
  video.poster = poster || ''
  video.title = title || ''

  if (type === 'hls') {
    console.log(props.useBrowserHls && video?.canPlayType('application/vnd.apple.mpegurl'))
    if (props.useBrowserHls && video?.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = srcStr;
    } else if (Hls.isSupported()) {
      const hls = new Hls({...defaultHlsConfig, ...props.hlsConfig});
      hls.loadSource(srcStr);
      hls.attachMedia(video);
      hlsInstance.value = hls;
    } else {
      throw new Error('Browser not supported hls')
    }
  } else {
    video.src = srcStr;
  }
}

watch(() => props.src, setSrc);

onMounted(() => setSrc(props.src));

onBeforeUnmount(destroyHls);

async function play() {
  const {value: el} = videoRef;
  try {
    el.playsInline = true
    el.autoplay = true
    el.muted = false
    await el?.play()
  } catch {
    el.muted = true
    await el?.play()
  }
}

defineExpose<IPlayerExpose>({
  get el() {
    return videoRef.value
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
  async pause() {
    await videoRef.value?.pause()
  },
  async unmute() {
    videoRef.value.muted = false
  },
})

</script>
