<template>
  <Teleport :to="webFullscreenTarget" :disabled="!isWebFullscreen">
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
          :src="src || playlist?.[0]"
          :hls-config="hlsConfig"
          :quality="quality"
          :use-browser-hls="useBrowserHls"
          @error="handleError"
          @play="isPlaying = true"
          @pause="isPlaying = false"
          @timeupdate="handleTimeUpdate"
          @loadedmetadata="handleLoadedMetadata"
          @ended="handleEnded"
          v-bind="$attrs"
          @src-change="$event.index = currentIndex; emit('srcChange', $event)"
      />

      <!-- 播放覆盖层 -->
      <div v-if="!isPlaying && controlsVisibility.playOverlay" class="gs-player-play-overlay">
        <div class="gs-play-overlay-button">
          <PlayOverlaySvg/>
        </div>
      </div>

      <!-- 错误信息 -->
      <div v-if="showError && error" class="gs-player-error">
        <ErrorSvg class="gs-icon-spin"/>
        <span>{{ props.i18n.errorMessage }}</span>
      </div>

      <!-- 默认插槽 -->
      <slot name="footer" v-bind="slotProps">
        <!-- 底部控制区域 -->
        <footer v-if="showControls" class="gs-player-footer" @dblclick.stop @click.stop>
          <!-- 进度条插槽 -->
          <slot name="progress" v-if="controlsVisibility.progress" v-bind="progressSlotProps">
            <!-- 进度条 -->
            <GsProgressBar/>
          </slot>

          <slot name="controls" v-bind="slotProps">
            <!-- 控制面板 -->
            <div class="gs-controls" :title="playerTitle">
              <!-- 播放/暂停 -->
              <GsPlayButton/>

              <!-- 上一个 -->
              <GsNavButton type="pre"/>

              <!-- 下一个 -->
              <GsNavButton type="next"/>

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
              <GsPlaybackModeControl/>

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
import {computed, onBeforeUnmount, onMounted, provide, ref} from 'vue';
import Player from '../core/Player.vue';
import {
  ControlType,
  IGsPlayerEmits,
  IGsPlayerExpose,
  IGsPlayerProps,
  IGsPlayerSlots,
  IPlayerExpose,
  PlaybackMode
} from '../types';
import {zhCN} from "./i18n/zhCN";
import {ErrorSvg, PlayOverlaySvg} from './svgs';
import {
  GsFullscreenControl,
  GsNavButton,
  GsPlaybackModeControl,
  GsPlayButton,
  GsProgressBar,
  GsSpeedControl,
  GsTimeDisplay,
  GsVolumeControl
} from './components';
import {usePlayerControls} from './composables';
import {PlayerInjectKey} from './types/PlayerInject';

const props = withDefaults(defineProps<IGsPlayerProps>(), {
  showControls: true,
  showError: true,
  handleClick: true,
  handleDblClick: true,
  playbackRates: () => [0.8, 1.0, 1.2, 1.5, 2.0, 3.0],
  visibleControls: () => ['play', 'pre', 'next', 'time', 'speed', 'volume', 'fullscreen', 'progress', 'playOverlay'],
  hiddenControls: () => [],
  webFullscreenTarget: 'body',
  fullscreenButtonMode: 'submenu',
  playlist: () => [],
  playbackMode: 'sequence',
  i18n: () => zhCN,
  keyboardTarget: '.gs-player',
});

const emit = defineEmits<IGsPlayerEmits>();

// Refs
const playerRef = ref() as { value: IPlayerExpose };
const playerContainerRef = ref<HTMLDivElement>();

// State
const error = ref(false);
const isPlaying = ref(false);
const isWebFullscreen = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const playbackRate = ref(1);
const currentPlaybackMode = ref(props.playbackMode || 'sequence');
const currentIndex = ref(0);

// 计算属性：避免模板中频繁调用方法
const controlsVisibility = computed(() => {
  const isVisible = (name: ControlType) =>
      !props.hiddenControls.includes(name) && props.visibleControls.includes(name);
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

const progress = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0);

// 可用的播放模式
const availablePlaybackModes = computed<Array<{
  value: PlaybackMode;
  text: string
}>>(() => {
  const modes: Array<{ value: PlaybackMode; text: string }> = [
    {value: 'sequence', text: props.i18n.playbackModes.sequence},
    {value: 'disabled', text: props.i18n.playbackModes.disabled},
    {value: 'loop', text: props.i18n.playbackModes.loop}
  ];

  // 如果设置了列表，添加全部循环和随机播放
  if (props.playlist && props.playlist.length > 0) {
    modes.push(
        {value: 'loopAll', text: props.i18n.playbackModes.loopAll},
        {value: 'shuffle', text: props.i18n.playbackModes.shuffle}
    );
  }

  return modes;
});

// 插槽属性
const progressSlotProps: any = computed(() => ({
  progress: progress.value,
  currentTime: currentTime.value,
  duration: duration.value
}));

const slotProps: any = computed(() => ({
  ...progressSlotProps.value,
  isPlaying: isPlaying.value,
  isWebFullscreen: isWebFullscreen.value,
  playbackRate: playbackRate.value,
  controlsVisibility: controlsVisibility.value
}));

// 状态设置函数
const setCurrentTime = (time: number) => currentTime.value = time;
const setDuration = (newDuration: number) => duration.value = newDuration;
const setError = (newError: boolean) => error.value = newError;
const setIsPlaying = (playing: boolean) => isPlaying.value = playing;

// 使用控制逻辑
const {
  // Methods
  handleError,
  handleTimeUpdate,
  handleLoadedMetadata,
  handleEnded,
  togglePlay,
  play,
  pause,
  unmute,
  playNext,
  playPre,
  setPlaybackMode: originalSetPlaybackMode,
  setPlaybackRate: originalSetPlaybackRate,
  setVolume: originalSetVolume,
  fullscreen,
  webFullscreen,
  pip,
  handlePlayerClick,
  handlePlayerDblClick,
  setSrc
} = usePlayerControls({
  playerRef,
  playerContainerRef,
  props,
  currentPlaybackMode,
  currentIndex,
  isPlaying,
  playbackRate,
  isWebFullscreen,
  setCurrentTime,
  setDuration,
  setError,
  setIsPlaying
});

// 计算播放器标题
const playerTitle = computed(() => {
  const hasPlaylist = props.playlist && props.playlist.length > 0;
  const currentSource: any = hasPlaylist && currentIndex.value >= 0 && currentIndex.value < props.playlist.length
      ? props.playlist[currentIndex.value]
      : props.src;
  const hasTitle = currentSource && typeof currentSource === 'object' && currentSource.title;

  if (hasPlaylist && hasTitle) {
    const currentPosition = currentIndex.value + 1;
    const totalCount = props.playlist.length;
    return `${currentSource.title} ( ${currentPosition}/${totalCount} )`;
  } else if (hasTitle) {
    return currentSource.title;
  } else if (hasPlaylist) {
    const currentPosition = currentIndex.value + 1;
    const totalCount = props.playlist.length;
    return `${currentPosition}/${totalCount}`;
  }
  return '';
});

// 包装方法，触发事件
const setPlaybackMode = (mode: string) => {
  originalSetPlaybackMode(mode as any);
  // @ts-ignore
  emit('playbackModeChange', mode as any);
};

const setPlaybackRate = (rate: number) => {
  originalSetPlaybackRate(rate);
  // @ts-ignore
  emit('playbackRateChange', rate as any);
};

// 提供依赖项给子组件
provide(PlayerInjectKey, {
  // 状态
  get error() {
    return error.value;
  },
  get isPlaying() {
    return isPlaying.value;
  },
  get isWebFullscreen() {
    return isWebFullscreen.value;
  },
  get currentTime() {
    return currentTime.value;
  },
  get duration() {
    return duration.value;
  },
  get playbackRate() {
    return playbackRate.value;
  },
  get currentPlaybackMode() {
    return currentPlaybackMode.value;
  },
  get currentIndex() {
    return currentIndex.value;
  },
  // 计算属性
  get controlsVisibility() {
    return controlsVisibility.value;
  },
  get progress() {
    return progress.value;
  },
  get availablePlaybackModes() {
    return availablePlaybackModes.value;
  },
  // Props
  get src() {
    return props.src;
  },
  get playlist() {
    return props.playlist;
  },
  get preSrc() {
    return props.preSrc;
  },
  get nextSrc() {
    return props.nextSrc;
  },
  get i18n() {
    return props.i18n;
  },
  get playbackRates() {
    return props.playbackRates;
  },
  get fullscreenButtonMode() {
    return props.fullscreenButtonMode;
  },
  get webFullscreenTarget() {
    return props.webFullscreenTarget;
  },
  // 方法
  handleError,
  handleTimeUpdate,
  handleLoadedMetadata,
  handleEnded,
  togglePlay,
  play,
  pause,
  unmute,
  playNext,
  playPre,
  setPlaybackMode,
  setPlaybackRate,
  setVolume: originalSetVolume,
  fullscreen,
  webFullscreen,
  pip,
  handlePlayerClick,
  handlePlayerDblClick,
  setSrc,
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
        playerRef.value.el.currentTime = Math.max(0, playerRef.value.el.currentTime - step);
      }
      break;
    case 'ArrowRight':
      // 向右调整进度（默认5秒）
      if (playerRef.value?.el) {
        const step = e.ctrlKey ? 15 : 5;
        playerRef.value.el.currentTime = Math.min(playerRef.value.el.duration || 0, playerRef.value.el.currentTime + step);
      }
      break;
    case 'ArrowUp':
      if (e.ctrlKey) {
        // Ctrl+上：上一个
        playPre();
      } else {
        // 向上调整播放速度
        if (playbackRate.value < Math.max(...props.playbackRates)) {
          const currentRateIndex = props.playbackRates.indexOf(playbackRate.value);
          if (currentRateIndex < props.playbackRates.length - 1) {
            setPlaybackRate(props.playbackRates[currentRateIndex + 1]);
          }
        }
      }
      break;
    case 'ArrowDown':
      if (e.ctrlKey) {
        // Ctrl+下：下一个
        playNext();
      } else {
        // 向下调整播放速度
        if (playbackRate.value > Math.min(...props.playbackRates)) {
          const currentRateIndex = props.playbackRates.indexOf(playbackRate.value);
          if (currentRateIndex > 0) {
            setPlaybackRate(props.playbackRates[currentRateIndex - 1]);
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

// 移除键盘事件监听
onBeforeUnmount(() => {
  // 移除普通键盘事件监听
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
  get muted() {
    return playerRef.value.muted
  },
  get paused() {
    return playerRef.value?.paused
  },
  get time() {
    return playerRef.value?.time
  },
  get duration() {
    return playerRef.value?.duration
  },
  get rate() {
    return playerRef.value?.rate
  },
  play, pause, togglePlay, unmute, setVolume: originalSetVolume, setPlaybackRate, fullscreen, webFullscreen, setSrc, playNext, playPre,
});
</script>
