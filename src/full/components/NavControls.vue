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

import type {IGsPlayerExpose, ISourceWrapper, PlayerSource} from '../../type';


import {IGsPlayerInject, GsPlayerInjectKey} from '../type/IGsPlayerInject';
import {INavControlsExpose} from "../type/ControlsExposes";
import {SourceWrapper} from "../type/SourceWrapper";

const gsPlayer = inject<IGsPlayerInject>(GsPlayerInjectKey)!;

const player = computed(() => gsPlayer.playerRef.value);

const videoEl = computed(() => player.value?.el);

const playlist = ref<ISourceWrapper[]>()

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
          if (!list.includes(s)) {
            wrapperMap.delete(s);
          }
        })
      } else {
        wrapperMap.clear()
      }
    },
    {immediate: true})

const index = computed(() => {
  if (!playlist.value) {
    return 0;
  }
  const i = (player.value?.src as ISourceWrapper)?._id;
  return playlist.value.findIndex((item) => item._id === i)
});

// 监听播放器ended事件
onMounted(() => {
  if (videoEl.value) {
    videoEl.value.addEventListener('ended', handleEnded);
  }
  const {props: {src}} = gsPlayer
  if (src) {
    setSrc(src);
  } else if (playlist.value?.length) {
    setSrc(playlist.value?.[0]);
  }
});

onBeforeUnmount(() => {
  wrapperMap.clear()
  if (videoEl.value) {
    videoEl.value.removeEventListener('ended', handleEnded);
  }
});

function changeSource(src: undefined | number | PlayerSource, pos: number, play?: boolean): Promise<void> {
  const el = player.value;
  const {value: list} = playlist;
  if (!(src instanceof SourceWrapper) && (src || src === 0)) {
    if (typeof src === "number") {
      src = list?.[src + pos];
    } else if (wrapperMap.has(src)) {
      src = wrapperMap.get(src);
    } else {
      let si = (index.value + pos) % list.length
      if (si < 0) {
        si = list.length - 1;
      }
      const wrapper = new SourceWrapper(src, id++);
      playlist.value?.splice(si, 0, wrapper)
      wrapperMap.set(src, wrapper)
      src = wrapper
    }
  }
  // noinspection TypeScriptValidateTypes
  gsPlayer.emit('srcChange', (src as ISourceWrapper)?._raw);
  if (play) {
    return el.play(src as PlayerSource);
  } else {
    el.setSrc(src as PlayerSource);
    return Promise.resolve()
  }
}

const play: IGsPlayerExpose['play'] = (src) => changeSource(src, 0, true)

const setSrc: IGsPlayerExpose['setSrc'] = (src) => changeSource(src, 0, false)

// 播放列表管理
const switchToNextInPlaylist = () => {
  const {value: list} = playlist;
  if (!list?.length) return;

  let nextIndex = index.value;
  if (gsPlayer.currentMode === 'shuffle') {
    // 随机播放，确保不重复当前索引
    do {
      nextIndex = Math.floor(Math.random() * list.length);
    } while (nextIndex === index.value && list.length > 1);
  } else {
    nextIndex = (index.value + 1) % list.length;
  }
  changeSource(nextIndex, 0, true)
};

function navTo(src: undefined | number | PlayerSource, dir: -1 | 1): Promise<void> {
  let {value: i} = index
  const {value: list} = playlist;
  let source: any = gsPlayer.props.preSrc;
  if (!source) {
    if (dir === -1) {
      source = list[i > 0 ? i - 1 : list.length - 1];
    } else {
      source = list[(i + 1) % list.length];
    }
  }
  return changeSource(source, -1, true)
}

// 导航控制
const playPre = () => navTo(gsPlayer.props.nextSrc, -1)

const playNext = () => navTo(gsPlayer.props.nextSrc, 1)

// 处理播放结束
const handleEnded = () => {
  const el = videoEl.value;
  const muted = el?.muted;

  switch (gsPlayer.currentMode) {
    case 'sequence':
      // 检查是否有下一个视频
      if (gsPlayer.props.nextSrc) {
        playNext();
      } else if (playlist.value?.length) {
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
    case 'deleteAfterPlay':
      if (playlist.value?.length) {
        // 从播放列表中删除当前视频
        const currentIndex = index.value;
        if (currentIndex >= 0 && currentIndex < playlist.value.length) {
          removePlaylistItem(currentIndex);
          // 如果还有视频，播放下一个
          if (playlist.value.length) {
            const nextIndex = currentIndex < playlist.value.length ? currentIndex : 0;
            changeSource(nextIndex, 0, true);
          } else {
            changeSource(undefined, 0, false);
          }
        }
      } else {
        changeSource(undefined, 0, false);
      }
      break;
  }
  if (el) {
    el.muted = muted;
  }
};

function removePlaylistItem(src: number | ISourceWrapper): void {
  const i = typeof src === 'number' ? src : playlist.value?.findIndex((item) => item._id === src?._id)
  const delSrc = playlist.value?.[i];
  if (!delSrc) return;
  playlist.value.splice(i, 1);
  wrapperMap.delete(delSrc._raw);

  // @ts-ignore
  gsPlayer.emit('srcRemove', delSrc._raw);
}

const alwaysShowNav = computed(() => playlist.value?.length > 1 && ['loopAll', 'shuffle'].includes(gsPlayer.currentMode));

// 计算属性
const hasPreSource = computed(() => gsPlayer.props.preSrc || playlist.value?.[index.value - 1])

const hasNextSource = computed(() => gsPlayer.props.nextSrc || playlist.value?.[index.value + 1])

// 暴露方法给父组件
defineExpose<INavControlsExpose>({
  get index() {
    return index.value
  },
  get playlist() {
    return playlist.value || []
  },
  handleEnded,
  play,
  playNext,
  playPre,
  setSrc,
  removePlaylistItem
});
</script>
