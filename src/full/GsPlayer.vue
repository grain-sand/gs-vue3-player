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
            <div class="gs-controls">
              <!-- 播放/暂停 -->
              <GsPlayButton
                :is-playing="isPlaying"
                :controls-visibility="controlsVisibility"
                :i18n="props.i18n"
                :toggle-play="togglePlay"
              />

              <!-- 上一个 -->
              <GsPreButton
                :controls-visibility="controlsVisibility"
                :pre-src="props.preSrc"
                :playlist="props.playlist"
                :current-index="currentIndex"
                :i18n="props.i18n"
                :switch-to-pre-src="switchToPreSrc"
              />

              <!-- 下一个 -->
              <GsNextButton
                :controls-visibility="controlsVisibility"
                :next-src="props.nextSrc"
                :playlist="props.playlist"
                :current-index="currentIndex"
                :i18n="props.i18n"
                :switch-to-next-src="switchToNextSrc"
              />

              <!-- 时间显示 -->
              <GsTimeDisplay
                :controls-visibility="controlsVisibility"
                :current-time="currentTime"
                :duration="duration"
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
import {ref} from 'vue';
import Player from '../core/Player.vue';
import {
  IGsPlayerExpose,
  IGsPlayerProps,
  IPlayerExpose,
  PlayerSource
} from '../types';
import {zhCN} from "./i18n/zhCN";
import { ErrorSvg } from './svgs';
import {
  GsProgressBar,
  GsPlayButton,
  GsPreButton,
  GsNextButton,
  GsTimeDisplay,
  GsSpeedControl,
  GsVolumeControl,
  GsPlaybackModeControl,
  GsFullscreenControl
} from './components';
import {usePlayer} from './composables';

const props = withDefaults(defineProps<IGsPlayerProps>(), {
  showControls: true,
  showError: true,
  handleClick: true,
  handleDblClick: true,
  playbackRates: () => [0.5, 0.8, 1.0, 1.2, 1.5, 2.0],
  visibleControls: () => ['play', 'pre', 'next', 'time', 'speed', 'volume', 'fullscreen', 'progress'],
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

// 使用 composable 管理播放器控制逻辑
const {
  // State
  error,
  isPlaying,
  isWebFullscreen,
  currentTime,
  duration,
  playbackRate,
  currentPlaybackMode,
  currentIndex,
  // Computed
  controlsVisibility,
  progress,
  availablePlaybackModes,
  progressSlotProps,
  slotProps,
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
} = usePlayer({ playerRef, playerContainerRef, props });

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
