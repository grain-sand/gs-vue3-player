<template>
  <Teleport :to="webFullscreenTarget" :disabled="!isWebFullscreen">
    <div
        class="gs-player"
        :class="{ 'is-web-fullscreen': isWebFullscreen }"
        ref="playerContainerRef"
        @click="handlePlayerClick"
        @dblclick="handlePlayerDblClick"
    >
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
          @srcChange="emit('srcChange', $event)"
          v-bind="$attrs"
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
import {computed, provide, ref} from 'vue';
import Player from '../core/Player.vue';
import {ControlType, IGsPlayerExpose, IGsPlayerProps, IPlayerExpose, PlaybackMode, PlayerSource} from '../types';
import {zhCN} from "./i18n/zhCN";
import {ErrorSvg, PlayOverlaySvg} from './svgs';
import {
  GsFullscreenControl,
  GsNavButton,
  GsPlaybackModeControl,
  GsPlayButton,
  GsProgressBar,
  GsSpeedControl, GsTimeDisplay,
  GsVolumeControl
} from './components';
import {usePlayerControls} from './composables';
import {PlayerInjectKey} from './types/PlayerInject';

const props = withDefaults(defineProps<IGsPlayerProps>(), {
  showControls: true,
  showError: true,
  handleClick: true,
  handleDblClick: true,
  playbackRates: () => [0.5, 0.8, 1.0, 1.2, 1.5, 2.0],
  visibleControls: () => ['play', 'pre', 'next', 'time', 'speed', 'volume', 'fullscreen', 'progress', 'playOverlay'],
  hiddenControls: () => [],
  webFullscreenTarget: 'body',
  fullscreenButtonMode: 'submenu',
  playlist: () => [],
  playbackMode: 'sequence',
  i18n: () => zhCN,
});

const emit = defineEmits<{
  (e: 'srcChange', src: PlayerSource): void;
  (e: 'volumeChange', volume: number): void;
  (e: 'playbackModeChange', mode: string): void;
  (e: 'playbackRateChange', rate: number): void;
}>();

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
const progressSlotProps = computed(() => ({
  progress: progress.value,
  currentTime: currentTime.value,
  duration: duration.value
}));

const slotProps = computed(() => ({
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
  switchToNextSrc,
  switchToPreSrc,
  setPlaybackMode: originalSetPlaybackMode,
  setPlaybackRate: originalSetPlaybackRate,
  setVolume: originalSetVolume,
  fullscreen,
  webFullscreen,
  pip,
  handlePlayerClick,
  handlePlayerDblClick
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
const setVolume = (volume: number) => {
  originalSetVolume(volume);
  emit('volumeChange', volume);
};

const setPlaybackMode = (mode: string) => {
  originalSetPlaybackMode(mode as any);
  emit('playbackModeChange', mode);
};

const setPlaybackRate = (rate: number) => {
  originalSetPlaybackRate(rate);
  emit('playbackRateChange', rate);
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
  switchToNextSrc,
  switchToPreSrc,
  setPlaybackMode,
  setPlaybackRate,
  setVolume,
  fullscreen,
  webFullscreen,
  pip,
  handlePlayerClick,
  handlePlayerDblClick,
  // Refs
  playerRef
});

defineExpose<IGsPlayerExpose>({
  get player() {
    return playerRef.value?.el;
  },
  play, pause, togglePlay, unmute, setVolume, setPlaybackRate, fullscreen, webFullscreen
});
</script>
