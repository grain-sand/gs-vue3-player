<template>
  <!-- 播放/暂停按钮 -->
  <div
      v-if="controlsVisibility.play"
      class="gs-btn"
      @click.stop="togglePlay"
      :title="i18n.titles.play"
  >
    <component :is="PlayStateIcons[isPlaying.toString()]"/>
  </div>
  <!-- 上一个按钮 -->
  <div
      v-if="controlsVisibility.pre && (alwaysShowNav || preSource)"
      class="gs-btn"
      @click.stop="playPre"
      :title="i18n.titles.pre"
  >
    <PreSvg/>
  </div>

  <!-- 下一个按钮 -->
  <div
      v-if="controlsVisibility.next && (alwaysShowNav || nextSource)"
      class="gs-btn"
      @click.stop="playNext"
      :title="i18n.titles.next"
  >
    <NextSvg/>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, onBeforeUnmount, ref} from 'vue';
import {PreSvg, NextSvg, PlayStateIcons} from '../../svgs';

import type {PlayerSource, PlaybackMode, ControlItemType, II18n} from '../../types';

// Props
const props = defineProps<{
  src?: PlayerSource;
  playlist?: PlayerSource[];
  preSrc?: PlayerSource;
  nextSrc?: PlayerSource;
  i18n: II18n;
  rates: number[];
  mode: PlaybackMode;
  controlsVisibility: Record<ControlItemType, boolean>;
  isPlaying: boolean;
  playerRef: {
    value: {
      el: HTMLVideoElement;
      play: (src?: any) => Promise<void>;
      pause: () => Promise<void>;
      playing: boolean
    } | undefined
  };
  togglePlay: () => void;
}>();

// 状态
const currentIndex = ref(0);
const currentMode = ref<PlaybackMode>(props.mode || 'sequence');

// 监听播放器ended事件
onMounted(() => {
  const el = props.playerRef.value?.el;
  if (el) {
    el.addEventListener('ended', handleEnded);
  }
});

onBeforeUnmount(() => {
  const el = props.playerRef.value?.el;
  if (el) {
    el.removeEventListener('ended', handleEnded);
  }
});

// 播放源控制
const playSource = async (src: PlayerSource) => {
  await props.playerRef.value?.play(src);
};

// 播放列表管理
const switchToNextInPlaylist = () => {
  if (!props.playlist || props.playlist.length === 0) return;

  let nextIndex = currentIndex.value;
  if (currentMode.value === 'shuffle') {
    // 随机播放，确保不重复当前索引
    do {
      nextIndex = Math.floor(Math.random() * props.playlist.length);
    } while (nextIndex === currentIndex.value && props.playlist.length > 1);
  } else {
    nextIndex = (currentIndex.value + 1) % props.playlist.length;
  }

  currentIndex.value = nextIndex;
  playSource(props.playlist[nextIndex]);
};

// 导航控制
const playPre = async () => {
  if (preSource.value) {
    await playSource(preSource.value);
    if (props.playlist.length) {
      let {value: i} = currentIndex
      if (i > 0) {
        i--;
      } else {
        i = props.playlist.length - 1;
      }
      currentIndex.value = i;
    }
  }
};

const playNext = async () => {
  if (nextSource.value) {
    await playSource(nextSource.value);
    if (props.playlist.length) {
      currentIndex.value = (currentIndex.value + 1 + props.playlist.length) % props.playlist.length;
    }
  }
};

// 处理播放结束
const handleEnded = () => {
  const el = props.playerRef.value?.el;
  const muted = el?.muted;

  switch (currentMode.value) {
    case 'sequence':
      // 检查是否有下一个视频
      if (props.nextSrc) {
        playNext();
      } else if (props.playlist && props.playlist.length > 0) {
        // 如果是播放列表的最后一个视频，则停止播放
        if (currentIndex.value < props.playlist.length - 1) {
          switchToNextInPlaylist();
        } else {
          props.playerRef.value?.pause();
        }
      } else {
        // 没有下一个视频，停止播放
        props.playerRef.value?.pause();
      }
      break;
    case 'disabled':
      // 停止播放
      props.playerRef.value?.pause();
      break;
    case 'loop':
      // 重新播放当前视频
      props.playerRef.value?.el?.play();
      break;
    case 'loopAll':
      switchToNextInPlaylist();
      break;
    case 'shuffle':
      switchToNextInPlaylist();
      break;
  }
  if (el) {
    el.muted = muted;
  }
};

const alwaysShowNav = computed(() => props.playlist?.length > 1 && ['loopAll', 'shuffle'].includes(currentMode.value));

// 计算属性
const preSource = computed(() => {
  return props.preSrc || props.playlist?.[currentIndex.value - 1];
});

const nextSource = computed(() => {
  return props.nextSrc || props.playlist?.[currentIndex.value + 1];
});

// 暴露方法给父组件
defineExpose({
  playPre,
  playNext,
  handleEnded
});
</script>
