<template>
  <!-- 播放/暂停按钮 -->
  <div
      v-if="player.controlsVisibility.play"
      class="gs-btn"
      @click.stop="player.togglePlay"
      :title="player.i18n.titles.play"
  >
    <component :is="PlayStateIcons[player.isPlaying.toString()]"/>
  </div>
  <!-- 上一个按钮 -->
  <div
      v-if="player.controlsVisibility.pre && (alwaysShowNav || hasPreSource)"
      class="gs-btn"
      @click.stop="playPre"
      :title="player.i18n.titles.pre"
  >
    <PreSvg/>
  </div>

  <!-- 下一个按钮 -->
  <div
      v-if="player.controlsVisibility.next && (alwaysShowNav || hasNextSource)"
      class="gs-btn"
      @click.stop="playNext"
      :title="player.i18n.titles.next"
  >
    <NextSvg/>
  </div>
</template>

<script setup lang="ts">
import {computed, inject, onBeforeUnmount, onMounted, ref} from 'vue';
import {NextSvg, PlayStateIcons, PreSvg} from '../../svgs';

import type {PlayerSource} from '../../types';


import {PlayerInject, PlayerInjectKey} from '../types/PlayerInject';

const player = inject<PlayerInject>(PlayerInjectKey)!;
// Props

// 状态
const currentIndex = ref(0);

// 监听播放器ended事件
onMounted(() => {
  const el = player.playerRef.value?.el;
  if (el) {
    el.addEventListener('ended', handleEnded);
  }
});

onBeforeUnmount(() => {
  const el = player.playerRef.value?.el;
  if (el) {
    el.removeEventListener('ended', handleEnded);
  }
});

// 播放源控制
const playSource = async (src: PlayerSource) => {
  await player.playerRef.value?.play(src);
  // noinspection TypeScriptValidateTypes
  player.emit('srcChange', {
    index: currentIndex.value,
    src
  })
};

// 播放列表管理
const switchToNextInPlaylist = () => {
  if (!player.playlist || player.playlist.length === 0) return;

  let nextIndex = currentIndex.value;
  if (player.currentMode === 'shuffle') {
    // 随机播放，确保不重复当前索引
    do {
      nextIndex = Math.floor(Math.random() * player.playlist.length);
    } while (nextIndex === currentIndex.value && player.playlist.length > 1);
  } else {
    nextIndex = (currentIndex.value + 1) % player.playlist.length;
  }

  currentIndex.value = nextIndex;
  playSource(player.playlist[nextIndex]);
};

// 导航控制
const playPre = async () => {
  let {value: i} = currentIndex
  const pre = i > 0 ? i - 1 : player.playlist?.length - 1;
  const source = player.preSrc || player.playlist?.[pre];
  if (source) {
    currentIndex.value = pre;
    await playSource(source);
  }
};

const playNext = async () => {
  const {playlist} = player;
  const next = (currentIndex.value + 1 + playlist?.length) % playlist?.length
  const source = player.nextSrc || playlist?.[next];
  if (source) {
    currentIndex.value = next;
    await playSource(source);
  }
};

// 处理播放结束
const handleEnded = () => {
  const el = player.playerRef.value?.el;
  const muted = el?.muted;

  switch (player.currentMode) {
    case 'sequence':
      // 检查是否有下一个视频
      if (player.nextSrc) {
        playNext();
      } else if (player.playlist && player.playlist.length > 0) {
        // 如果是播放列表的最后一个视频，则停止播放
        if (currentIndex.value < player.playlist.length - 1) {
          switchToNextInPlaylist();
        } else {
          player.playerRef.value?.pause();
        }
      } else {
        // 没有下一个视频，停止播放
        player.playerRef.value?.pause();
      }
      break;
    case 'disabled':
      // 停止播放
      player.playerRef.value?.pause();
      break;
    case 'loop':
      // 重新播放当前视频
      player.playerRef.value?.el?.play();
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

const alwaysShowNav = computed(() => player.playlist?.length > 1 && ['loopAll', 'shuffle'].includes(player.currentMode));

// 计算属性
const hasPreSource = computed(() => player.preSrc || player.playlist?.[currentIndex.value - 1])

const hasNextSource = computed(() => player.nextSrc || player.playlist?.[currentIndex.value + 1])

// 暴露方法给父组件
defineExpose({
  playPre,
  playNext,
  handleEnded
});
</script>
