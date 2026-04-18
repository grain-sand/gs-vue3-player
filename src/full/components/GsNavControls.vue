<template>
  <!-- 播放/暂停按钮 -->
  <div
      v-if="gsPlayer.controlsVisibility.play"
      class="gs-btn"
      @click.stop="gsPlayer.togglePlay"
      :title="gsPlayer.props.i18n.titles.play"
  >
    <component :is="PlayStateIcons[(player?.playing || false).toString()]"/>
  </div>
  <!-- 上一个按钮 -->
  <div
      v-if="gsPlayer.controlsVisibility.pre && (alwaysShowNav || hasPreSource)"
      class="gs-btn"
      @click.stop="playPre"
      :title="gsPlayer.props.i18n.titles.pre"
  >
    <PreSvg/>
  </div>

  <!-- 下一个按钮 -->
  <div
      v-if="gsPlayer.controlsVisibility.next && (alwaysShowNav || hasNextSource)"
      class="gs-btn"
      @click.stop="playNext"
      :title="gsPlayer.props.i18n.titles.next"
  >
    <NextSvg/>
  </div>
</template>

<script setup lang="ts">
import {computed, inject, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {NextSvg, PlayStateIcons, PreSvg} from '../../svgs';

import type {IGsPlayerExpose, PlayerSource} from '../../types';


import {IGsPlayerInject, PlayerInjectKey} from '../types/IGsPlayerInject';
import {INavControlsExpose} from "../types/ControlsExposes";
import {SourceWrapper} from "../types/SourceWrapper";

const gsPlayer = inject<IGsPlayerInject>(PlayerInjectKey)!;

const player = computed(() => gsPlayer.playerRef.value);

const videoEl = computed(() => player.value?.el);

const playlist = ref<SourceWrapper[]>([])

let id = 0;

const wrapperMap = new Map<PlayerSource, SourceWrapper>();

watch(
    () => [...(gsPlayer.props.playlist ?? [])],
    (list) => {
      playlist.value =
          list?.map((src) => {
            let wrapper = wrapperMap.get(src)
            if (!wrapper) {
              wrapper = new SourceWrapper(src as any, id++)
              wrapperMap.set(src, wrapper)
            }
            return wrapper
          }) || []
      if (list.length) {
        Array.from(wrapperMap.keys()).forEach(s => {
          if (!list.indexOf(s)) {
            wrapperMap.delete(s);
          }
        })
      } else {
        wrapperMap.clear()
      }
    },
    {immediate: true})

const index = computed(() => playlist.value.findIndex((item) => item.index === (player.value?.src as any)?.index));

// 监听播放器ended事件
onMounted(() => {
  if (videoEl.value) {
    videoEl.value.addEventListener('ended', handleEnded);
  }
  const {props: {src}} = gsPlayer
  if (src) {
    setSrc(src);
  } else if (playlist.value.length) {
    setSrc(playlist.value[0]);
  }
});

onBeforeUnmount(() => {
  if (videoEl.value) {
    videoEl.value.removeEventListener('ended', handleEnded);
  }
});

function changeSource(src: undefined | number | PlayerSource, pos: number, play?: boolean) {

}

const play: IGsPlayerExpose['play'] = async (src) => {
  if (!src && src !== 0) return;
  if (typeof src === "number") {
    const source = playlist.value[src];
    if (source) {
      await playSource(source);
    }
  } else if (src) {
    const i = playlist.value.indexOf(src);
    if (i < 0) {
      playlist.value.splice(index.value, 0, src)
    }
    await playSource(src);
  }
}

function setSrc(src: number | PlayerSource) {
  if (!src && src !== 0) return;
  const {props: {playlist}, playerRef: {value: el}} = gsPlayer;
  if (typeof src === "number") {
    const source = playlist?.[src];
    if (source) {
      el.setSrc(source);
    }
  } else if (src) {
    const i = playlist.indexOf(src);
    if (i < 0) {
      playlist.splice(index.value, 0, src)
    }
    el.setSrc(src);
  }
}

// 播放源控制
const playSource = async (src: SourceWrapper) => {
  await player.value?.play(src);
  // noinspection TypeScriptValidateTypes
  gsPlayer.emit('srcChange', (src as any).data)
};

// 播放列表管理
const switchToNextInPlaylist = () => {
  const {value: list} = playlist;
  if (!list.length) return;

  let nextIndex = index.value;
  if (gsPlayer.currentMode === 'shuffle') {
    // 随机播放，确保不重复当前索引
    do {
      nextIndex = Math.floor(Math.random() * list.length);
    } while (nextIndex === index.value && list.length > 1);
  } else {
    nextIndex = (index.value + 1) % list.length;
  }
  playSource(list[nextIndex]);
};

// 导航控制
const playPre = async () => {
  let {value: i} = index
  const {value: list} = playlist;
  let source: any = gsPlayer.props.preSrc;
  if (source) {
    if (!(source instanceof SourceWrapper)) {
      return new SourceWrapper(source, id++)
    }
  } else {
    source = list[i > 0 ? i - 1 : list.length - 1];
  }
  if (source) {
    await playSource(source);
  }
};

const playNext = async () => {
  let {value: i} = index
  const {value: list} = playlist;
  let source: any = gsPlayer.props.preSrc;
  if (source) {
    if (!(source instanceof SourceWrapper)) {
      source = new SourceWrapper(source, id++)
    }
  } else {
    source = list[(i + 1) % list.length];
  }
  if (source) {
    await playSource(source);
  }
};

// 处理播放结束
const handleEnded = () => {
  const el = videoEl.value;
  const muted = el?.muted;

  switch (gsPlayer.currentMode) {
    case 'sequence':
      // 检查是否有下一个视频
      if (gsPlayer.props.nextSrc) {
        playNext();
      } else if (playlist.value && playlist.value.length > 0) {
        // 如果是播放列表的最后一个视频，则停止播放
        if (index.value < playlist.value.length - 1) {
          switchToNextInPlaylist();
        } else {
          el?.pause();
        }
      } else {
        // 没有下一个视频，停止播放
        el?.pause();
      }
      break;
    case 'disabled':
      // 停止播放
      el?.pause();
      break;
    case 'loop':
      // 重新播放当前视频
      el?.play().catch(console.error);
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

const alwaysShowNav = computed(() => playlist.value?.length > 1 && ['loopAll', 'shuffle'].includes(gsPlayer.currentMode));

// 计算属性
const hasPreSource = computed(() => gsPlayer.props.preSrc || playlist.value?.[index.value - 1])

const hasNextSource = computed(() => gsPlayer.props.nextSrc || playlist.value?.[index.value + 1])

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
