<template>
  <Teleport :to="fullTarget" :disabled="!isWebFullscreen">
    <div
        class="gs-player"
        :class="{ 'is-web-fullscreen': isWebFullscreen }"
        ref="playerContainerRef"
        @click="handlePlayerClick"
        @dblclick="handlePlayerDblClick"
    >
      <!-- @vue-ignore-->
      <Player
          ref="playerRef"
          :hls-config="hlsConfig"
          :quality="quality"
          :use-browser-hls="useBrowserHls"
          :rate="rate"
          :src="src"
          :volume="volume"
          :autoplay="autoplay"
          :showControls='false'
          :muted="muted"
          @volume-change="emit('volumeChange', $event)"
          @rate-change="emit('rateChange', $event)"
      />

      <!-- 播放覆盖层 -->
      <div v-if="(!playerRef?.playing || playerRef?.muted) && controlsVisibility.playOverlay"
           class="gs-player-play-overlay" :class="{muted:playerRef?.muted,paused:!playerRef?.playing}">
        <div class="gs-play-overlay-button">
          <PlayOverlaySvg v-if="!playerRef?.playing"/>
          <MuteSvg v-else-if="playerRef?.muted"/>
        </div>
      </div>

      <!-- 错误信息 -->
      <div v-if="showError && playerRef?.error" class="gs-player-error">
        <ErrorSvg class="gs-icon-spin"/>
        <span>{{ props.i18n.errorMessage }}</span>
      </div>

      <!-- 默认插槽 -->
      <slot name="footer" v-bind="slotProps">
        <!-- 底部控制区域 -->
        <footer v-if="props.showControls" class="gs-player-footer" @dblclick.stop @click.stop>
          <!-- 进度条插槽 -->
          <slot name="progress" v-if="controlsVisibility.progress" v-bind="progressSlotProps">
            <!-- 进度条 -->
            <GsProgressBar/>
          </slot>

          <slot name="controls" v-bind="slotProps">
            <!-- 控制面板 -->
            <div class="gs-controls" :title="playerTitle">
              <!-- 导航按钮组 -->
              <GsNavControls ref="navControlsRef"/>

              <!-- 时间显示 -->
              <GsTimeDisplay/>
              <div class="space"></div>
              <slot v-bind="slotProps">
              </slot>
              <div class="space"></div>

              <!-- 速度控制 -->
              <GsSpeedControl/>

              <!-- 音量控制 -->
              <GsVolumeControl/>

              <!-- 播放模式 -->
              <GsModeControl/>

              <!-- 全屏控制 -->
              <GsFullscreenControl/>
            </div>
          </slot>
        </footer>
      </slot>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, provide, ref, watch} from 'vue';
import Player from '../core/Player.vue';
import {
  ControlItemType,
  IGsPlayerEmits,
  IGsPlayerExpose,
  IGsPlayerProps,
  IGsPlayerSlots,
  IPlayerExpose,
  PlaybackMode
} from '../types';
import {zhCN} from "./i18n/zhCN";
import {ErrorSvg, MuteSvg, PlayOverlaySvg} from '../svgs';
import {
  GsFullscreenControl,
  GsNavControls,
  GsModeControl,
  GsProgressBar,
  GsSpeedControl,
  GsTimeDisplay,
  GsVolumeControl
} from './components';
import {IPlayerInject, PlayerInjectKey} from './types/IPlayerInject';
import {INavControlsExpose} from "./types/INavControlsExpose";

const props = withDefaults(defineProps<IGsPlayerProps>(), {
  showControls: true,
  showError: true,
  handleClick: true,
  handleDblClick: true,
  rates: () => [0.8, 1.0, 1.2, 1.5, 2.0, 3.0],
  visibleItems: () => ['play', 'pre', 'next', 'time', 'speed', 'volume', 'fullscreen', 'progress', 'playOverlay'],
  hiddenItems: () => [],
  fullscreenButtonMode: 'submenu',
  playlist: () => [],
  mode: 'sequence',
  i18n: () => zhCN,
  keyboardTarget: '.gs-player',
});

const emit = defineEmits<IGsPlayerEmits>();

// Refs
const playerRef = ref<IPlayerExpose>();
const playerContainerRef = ref<HTMLDivElement>();
const navControlsRef = ref<INavControlsExpose>();

// State
const isWebFullscreen = ref(false);
const currentMode = ref(props.mode || 'sequence');

const fullTarget = computed(() => props.webFullscreenTarget || document.body);

const src = computed(() => props.src || props.playlist?.[0]);

watch(src, (newSrc) => {
  if (newSrc) {
    // @ts-ignore
    emit('srcChange', {src: newSrc, index: 0});
  }
}, {immediate: true})

// 计算属性：避免模板中频繁调用方法
const controlsVisibility = computed(() => {
  const isVisible = (name: ControlItemType) =>
      !props.hiddenItems.includes(name) && props.visibleItems.includes(name);
  return {
    play: isVisible('play'),
    pre: isVisible('pre'),
    next: isVisible('next'),
    time: isVisible('time'),
    speed: isVisible('speed'),
    volume: isVisible('volume'),
    fullscreen: isVisible('fullscreen'),
    progress: isVisible('progress'),
    playOverlay: isVisible('playOverlay')
  };
});

// 插槽属性
const progressSlotProps: any = computed(() => ({
  progress: playerRef.value?.duration ? (playerRef.value.time / playerRef.value.duration) * 100 : 0,
  currentTime: playerRef.value?.time || 0,
  duration: playerRef.value?.duration || 0
}));

const slotProps: any = computed(() => ({
  ...progressSlotProps.value,
  isPlaying: playerRef.value?.playing || false,
  isWebFullscreen: isWebFullscreen.value,
  playbackRate: playerRef.value?.rate || 1,
  controlsVisibility: controlsVisibility.value
}));


// 播放控制
const togglePlay = () => playerRef.value?.togglePlay()

const play = (src?: number | any) => navControlsRef.value?.play(src);

const pause = () => playerRef.value?.pause();

const unmute = () => playerRef.value?.unmute();

// 其他设置
const setRate = (rate: number) => {
  if (playerRef.value?.el) playerRef.value.rate = rate;
};

const setVolume = (volume: number) => playerRef.value?.setVolume(volume)


const handlePlayerClick = async () => {
  if (!props.handleClick || !playerRef.value?.el) return;
  const {el} = playerRef.value;
  if (el.muted) {
    await unmute();
    await play();
  } else {
    await togglePlay();
  }
};

const handlePlayerDblClick = () => {
  if (!props.handleDblClick) return;
  if (document.fullscreenElement) document.exitFullscreen();
  else {
    isWebFullscreen.value = !isWebFullscreen.value;
  }
};

// 监听 playlist 变化
watch(() => props.playlist,
    (newPlaylist) => {
      if (newPlaylist && newPlaylist.length > 0) {
        // 如果没有设置 src，则使用 playlist 中的第一个视频
        if (!props.src) {
          playerRef.value?.play(newPlaylist[0]);
        }
      }
    }
);

// 计算播放器标题
const playerTitle = computed(() => {
  const hasPlaylist = props.playlist && props.playlist.length > 0;
  const currentIdx = navControlsRef.value?.index || 0;
  const currentSource: any = hasPlaylist && currentIdx >= 0 && currentIdx < props.playlist.length
      ? props.playlist[currentIdx]
      : props.src;
  const hasTitle = currentSource && typeof currentSource === 'object' && currentSource.title;

  if (hasPlaylist && hasTitle) {
    const currentPosition = currentIdx + 1;
    const totalCount = props.playlist.length;
    return `${currentSource.title} ( ${currentPosition}/${totalCount} )`;
  } else if (hasTitle) {
    return currentSource.title;
  } else if (hasPlaylist) {
    const currentPosition = currentIdx + 1;
    const totalCount = props.playlist.length;
    return `${currentPosition}/${totalCount}`;
  }
  return '';
});

// 包装方法，触发事件
const setMode = (mode: string) => {
  currentMode.value = mode as PlaybackMode;
  // @ts-ignore
  emit('modeChange', mode as any);
};

// 提供依赖项给子组件
provide<IPlayerInject>(PlayerInjectKey, {
  // 状态
  get currentMode() {
    return currentMode.value;
  },
  get currentIndex() {
    return navControlsRef.value?.index || 0;
  },
  // 计算属性
  get controlsVisibility() {
    return controlsVisibility.value;
  },
  // Props
  props,
  //
  isWebFullscreen,
  emit,
  // 方法
  togglePlay,
  play,
  pause,
  unmute,
  setMode,
  setRate,
  setVolume,
  // Refs
  playerRef
});

// 键盘事件处理
const handleKeydown = (e: KeyboardEvent) => {
  // 避免在输入框中触发
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      // 向左调整进度（默认5秒）
      if (playerRef.value?.el) {
        const step = e.ctrlKey ? 15 : 5;
        playerRef.value.time = Math.max(0, playerRef.value.time - step);
      }
      break;
    case 'ArrowRight':
      // 向右调整进度（默认5秒）
      if (playerRef.value?.el) {
        const step = e.ctrlKey ? 15 : 5;
        playerRef.value.time = Math.min(playerRef.value.el.duration || 0, playerRef.value.time + step);
      }
      break;
    case 'ArrowUp':
      if (e.ctrlKey) {
        // Ctrl+上：上一个
        navControlsRef.value?.playPre();
      } else {
        // 向上调整播放速度
        const currentRate = playerRef.value?.rate || 1;
        if (currentRate < Math.max(...props.rates)) {
          const currentRateIndex = props.rates.indexOf(currentRate);
          if (currentRateIndex < props.rates.length - 1) {
            setRate(props.rates[currentRateIndex + 1]);
          }
        }
      }
      break;
    case 'ArrowDown':
      if (e.ctrlKey) {
        // Ctrl+下：下一个
        navControlsRef.value?.playNext();
      } else {
        // 向下调整播放速度
        const currentRate = playerRef.value?.rate || 1;
        if (currentRate > Math.min(...props.rates)) {
          const currentRateIndex = props.rates.indexOf(currentRate);
          if (currentRateIndex > 0) {
            setRate(props.rates[currentRateIndex - 1]);
          }
        }
      }
      break;
    case ' ': // 空格键
      e.preventDefault();
      togglePlay();
      break;
    case 'Escape':
    case 'Enter':
      // 与双击功能一致
      handlePlayerDblClick();
      break;
  }
};

// 键盘事件目标元素
let keyboardEventTarget: EventTarget | null = null;

// 监听键盘事件
onMounted(() => {
  // 普通键盘事件根据keyboardTarget注册
  if (props.keyboardTarget !== false) {
    if (typeof props.keyboardTarget === 'string') {
      // 如果是字符串选择器，尝试获取元素
      keyboardEventTarget = document.querySelector(props.keyboardTarget);
      // 如果没有找到元素，默认使用播放器容器
      if (!keyboardEventTarget && props.keyboardTarget === '.gs-player') {
        keyboardEventTarget = playerContainerRef.value;
      }
    } else if (props.keyboardTarget instanceof HTMLElement) {
      // 如果是HTMLElement，直接使用
      keyboardEventTarget = props.keyboardTarget;
    } else {
      // 默认使用播放器容器
      keyboardEventTarget = playerContainerRef.value;
    }

    // 如果找到目标元素，添加事件监听器
    if (keyboardEventTarget) {
      // 确保元素可以获取焦点
      if (keyboardEventTarget instanceof HTMLElement && !keyboardEventTarget.hasAttribute('tabindex')) {
        keyboardEventTarget.setAttribute('tabindex', '0');
      }
      keyboardEventTarget.addEventListener('keydown', handleKeydown);
    }
  }

});

onBeforeUnmount(() => {
  if (keyboardEventTarget) {
    keyboardEventTarget.removeEventListener('keydown', handleKeydown);
  }
});

defineSlots<IGsPlayerSlots>()

defineExpose<IGsPlayerExpose>({
  get player() {
    return playerRef.value?.el;
  },
  get volume() {
    return playerRef.value.volume
  },
  set volume(v) {
    playerRef.value.volume = v
  },
  get muted() {
    return playerRef.value.muted
  },
  set muted(v) {
    playerRef.value.muted = v
  },
  get time() {
    return playerRef.value?.time
  },
  set time(v) {
    playerRef.value.time = v;
  },
  get duration() {
    return playerRef.value?.duration
  },
  get rate() {
    return playerRef.value?.rate
  },
  set rate(v) {
    playerRef.value.rate = v
  },
  get playing() {
    return playerRef.value?.playing
  },
  get error() {
    return playerRef.value?.error;
  },
  get index() {
    return navControlsRef.value?.index;
  },
  play, pause, togglePlay, unmute, setVolume, setRate,
  fullscreen: () => {
    const el = playerContainerRef?.value || document.querySelector('.gs-player');
    if (!document.fullscreenElement && el) el.requestFullscreen().catch(console.error);
    else if (document.exitFullscreen) document.exitFullscreen();
  },
  webFullscreen: () => {
    const el = playerContainerRef?.value || document.querySelector('.gs-player');
    if (el) el.classList.toggle('web-fullscreen');
  },
  playPre: () => navControlsRef.value?.playPre(),
  playNext: () => navControlsRef.value?.playNext(),
  setSrc: (src: any) => playerRef.value?.setSrc(src),
});
</script>
