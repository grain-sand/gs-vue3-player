<template>
  <!-- 播放/暂停按钮 -->
  <div
      v-if="player.controlsVisibility.play"
      class="gs-btn"
      @click.stop="player.togglePlay"
      :title="player.props.i18n.titles.play"
  >
    <component :is="PlayStateIcons[(player.playerRef.value?.playing || false).toString()]"/>
  </div>
  <!-- 上一个按钮 -->
  <div
      v-if="player.controlsVisibility.pre && (alwaysShowNav || hasPreSource)"
      class="gs-btn"
      @click.stop="playPre"
      :title="player.props.i18n.titles.pre"
  >
    <PreSvg/>
  </div>

  <!-- 下一个按钮 -->
  <div
      v-if="player.controlsVisibility.next && (alwaysShowNav || hasNextSource)"
      class="gs-btn"
      @click.stop="playNext"
      :title="player.props.i18n.titles.next"
  >
    <NextSvg/>
  </div>
</template>

<script setup lang="ts">
import {computed, inject, onBeforeUnmount, onMounted, ref} from 'vue';
import {NextSvg, PlayStateIcons, PreSvg} from '../../svgs';

import type {IGsPlayerExpose, PlayerSource} from '../../types';


import {IGsPlayerInject, PlayerInjectKey} from '../types/IGsPlayerInject';
import {INavControlsExpose} from "../types/ControlsExposes";

const player = inject<IGsPlayerInject>(PlayerInjectKey)!;
// Props

// 状态
const index = ref(0);

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

const play: IGsPlayerExpose['play'] = async (src) => {
  if (!src && src !== 0) return;
  const {playlist} = player.props;
  if (typeof src === "number") {
    const source = playlist?.[src];
    if (source) {
      index.value = src;
      await playSource(source);
    }
  } else {
    const i = playlist?.findIndex(s => s === src)
    if (i > -1) {
      index.value = i;
      await playSource(src);
    } else if (playlist?.length) {
      let {value: v} = index
      index.value = v > 0 ? v - 1 : playlist.length - 1;
      await playSource(src, -1);
    }
  }
}

function setSrc(src: number | PlayerSource) {
  if (!src && src !== 0) return;
  const {playlist} = player.props;
  if (typeof src === "number") {
    const source = playlist?.[src];
    if (source) {
      index.value = src;
      player.playerRef.value?.setSrc(source);
    }
  } else {
    const i = playlist?.findIndex(s => s === src)
    if (i > -1) {
      index.value = i;
      player.playerRef.value?.setSrc(src);
    } else if (playlist?.length) {
      let {value: v} = index
      index.value = v > 0 ? v - 1 : playlist.length - 1;
      player.playerRef.value?.setSrc(src);
    }
  }
}

// 播放源控制
const playSource = async (src: PlayerSource, i = index.value) => {
  await player.playerRef.value?.play(src);
  // noinspection TypeScriptValidateTypes
  player.emit('srcChange', {
    index: i,
    src
  })
};

// 播放列表管理
const switchToNextInPlaylist = () => {
  if (!player.props.playlist || player.props.playlist.length === 0) return;

  let nextIndex = index.value;
  if (player.currentMode === 'shuffle') {
    // 随机播放，确保不重复当前索引
    do {
      nextIndex = Math.floor(Math.random() * player.props.playlist.length);
    } while (nextIndex === index.value && player.props.playlist.length > 1);
  } else {
    nextIndex = (index.value + 1) % player.props.playlist.length;
  }

  index.value = nextIndex;
  playSource(player.props.playlist[nextIndex]);
};

// 导航控制
const playPre = async () => {
  let {value: i} = index
  const pre = i > 0 ? i - 1 : player.props.playlist?.length - 1;
  const source = player.props.preSrc || player.props.playlist?.[pre];
  if (source) {
    index.value = pre;
    await playSource(source);
  }
};

const playNext = async () => {
  const {playlist} = player.props;
  const next = (index.value + 1 + playlist?.length) % playlist?.length
  const source = player.props.nextSrc || playlist?.[next];
  if (source) {
    index.value = next;
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
      if (player.props.nextSrc) {
        playNext();
      } else if (player.props.playlist && player.props.playlist.length > 0) {
        // 如果是播放列表的最后一个视频，则停止播放
        if (index.value < player.props.playlist.length - 1) {
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
      player.playerRef.value?.el?.play().catch(console.error);
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

const alwaysShowNav = computed(() => player.props.playlist?.length > 1 && ['loopAll', 'shuffle'].includes(player.currentMode));

// 计算属性
const hasPreSource = computed(() => player.props.preSrc || player.props.playlist?.[index.value - 1])

const hasNextSource = computed(() => player.props.nextSrc || player.props.playlist?.[index.value + 1])

// 暴露方法给父组件
defineExpose<INavControlsExpose>({
  play,
  playPre,
  playNext,
  handleEnded,
  get index() {
    return index.value;
  },
  setSrc
});
</script>
