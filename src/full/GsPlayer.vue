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
            <GsProgressBar
                :progress="progress"
                :current-time="currentTime"
                :duration="duration"
                :player-ref="playerRef"
            />
          </slot>

          <slot name="controls" v-bind="slotProps">
            <!-- 控制面板 -->
            <div class="gs-controls" :title="playerTitle">
              <!-- 播放/暂停 -->
              <GsPlayButton
                  :is-playing="isPlaying"
                  :controls-visibility="controlsVisibility"
                  :i18n="props.i18n"
                  :toggle-play="togglePlay"
              />

              <!-- 上一个 -->
              <GsNavButton
                  type="pre"
                  :controls-visibility="controlsVisibility"
                  :pre-src="props.preSrc"
                  :next-src="props.nextSrc"
                  :playlist="props.playlist"
                  :current-index="currentIndex"
                  :i18n="props.i18n"
                  :switch-to-pre-src="switchToPreSrc"
                  :switch-to-next-src="switchToNextSrc"
              />

              <!-- 下一个 -->
              <GsNavButton
                  type="next"
                  :controls-visibility="controlsVisibility"
                  :pre-src="props.preSrc"
                  :next-src="props.nextSrc"
                  :playlist="props.playlist"
                  :current-index="currentIndex"
                  :i18n="props.i18n"
                  :switch-to-pre-src="switchToPreSrc"
                  :switch-to-next-src="switchToNextSrc"
              />

              <!-- 时间显示 -->
              <GsTimeDisplay
                  :controls-visibility="controlsVisibility"
                  :current-time="currentTime"
                  :duration="duration"
                  :list-len="props.playlist?.length"
                  :current-index="currentIndex"
              />
              <div class="space"></div>
              <slot v-bind="slotProps">
              </slot>
              <div class="space"></div>

              <!-- 速度控制 -->
              <GsSpeedControl
                  :controls-visibility="controlsVisibility"
                  :playback-rate="playbackRate"
                  :playback-rates="props.playbackRates"
                  :i18n="props.i18n"
                  :set-playback-rate="setPlaybackRate"
              />

              <!-- 音量控制 -->
              <GsVolumeControl
                  :controls-visibility="controlsVisibility"
                  :i18n="props.i18n"
                  :player-ref="playerRef"
                  :on-volume-change="setVolume"
              />

              <!-- 播放模式 -->
              <GsPlaybackModeControl
                  :controls-visibility="controlsVisibility"
                  :current-playback-mode="currentPlaybackMode"
                  :available-playback-modes="availablePlaybackModes"
                  :i18n="props.i18n"
                  :set-playback-mode="setPlaybackMode"
              />

              <!-- 全屏控制 -->
              <GsFullscreenControl
                  :controls-visibility="controlsVisibility"
                  :fullscreen-button-mode="props.fullscreenButtonMode"
                  :i18n="props.i18n"
                  :web-fullscreen="webFullscreen"
                  :fullscreen="fullscreen"
                  :pip="pip"
              />
            </div>
          </slot>
        </footer>
      </slot>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
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
  GsSpeedControl,
  GsTimeDisplay,
  GsVolumeControl
} from './components';
import {usePlayerControls} from './composables';

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

defineExpose<IGsPlayerExpose>({
  get player() {
    return playerRef.value?.el;
  },
  play, pause, togglePlay, unmute, setVolume, setPlaybackRate, fullscreen, webFullscreen
});
</script>
