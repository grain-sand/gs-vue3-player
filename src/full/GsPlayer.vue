<template>
  <Teleport :to="props.webFullscreenTarget" :disabled="!isWebFullscreen">
    <div
        class="gs-player"
        :class="{ 'is-web-fullscreen': isWebFullscreen }"
        ref="playerContainerRef"
        @click="handlePlayerClick"
        @dblclick="handlePlayerDblClick"
    >
      <Player
          ref="playerRef"
          :src="props.src"
          :hls-config="props.hlsConfig"
          :quality="props.quality"
          :use-browser-hls="props.useBrowserHls"
          @error="handleError"
          @play="isPlaying = true"
          @pause="isPlaying = false"
          @timeupdate="handleTimeUpdate"
          @loadedmetadata="handleLoadedMetadata"
          @srcChange="emit('srcChange', $event)"
          v-bind="$attrs"
      />

      <!-- 错误信息 -->
      <div v-if="props.showError && error" class="gs-player-error">
        <svg viewBox="0 0 24 24" class="gs-icon-spin">
          <path fill="currentColor"
                d="M12 2v4c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8H2c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2z"/>
        </svg>
        <span>{{ props.errorMessage }}</span>
      </div>

      <!-- 默认插槽 -->
      <slot name="footer" v-bind="slotProps">
        <!-- 底部控制区域 -->
        <footer v-if="props.showControls" class="gs-player-footer" @dblclick.stop @click.stop>
          <!-- 进度条插槽 -->
          <slot name="progress" v-if="controlsVisibility.progress" v-bind="progressSlotProps">
            <!-- 进度条 -->
            <div class="gs-progress-container" @click.stop="handleProgressClick" @mousemove="handleProgressMouseMove"
                 @mouseleave="handleProgressMouseLeave">
              <div class="gs-progress-track">
                <div class="gs-progress-fill" :style="{ width: `${progress}%` }"></div>
                <div class="gs-progress-handle" :style="{ left: `${progress}%` }"></div>
                <!-- 时间提示 -->
                <div v-show="showProgressTooltip" class="gs-progress-tooltip" :style="{ left: `${tooltipPosition}%` }">
                  {{ formatTime(tooltipTime) }}
                </div>
              </div>
            </div>
          </slot>

          <slot name="controls" v-bind="slotProps">
            <!-- 控制面板 -->
            <div class="gs-controls">

              <!-- 播放/暂停 -->
              <div v-if="controlsVisibility.play" class="gs-btn" @click.stop="togglePlay">
                <svg v-if="isPlaying" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24">
                  <path fill="currentColor" d="M8 5v14l11-7z"/>
                </svg>
              </div>

              <!-- 上一个 -->
              <div v-if="controlsVisibility.pre && props.preSrc" class="gs-btn" @click.stop="switchToPreSrc">
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6 6h2v12H6zm3.5 6l8.5 6V6l-8.5 6z"/>
                </svg>
              </div>

              <!-- 下一个 -->
              <div v-if="controlsVisibility.next && nextSrc" class="gs-btn" @click.stop="switchToNextSrc">
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </svg>
              </div>

              <!-- 时间显示 -->
              <div v-if="controlsVisibility.time" class="gs-time-display">
                {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
              </div>

              <slot v-bind="slotProps">
              </slot>

              <!-- 右侧控制 -->
              <div class="gs-controls-right">
                <!-- 倍速 -->
                <div v-if="controlsVisibility.speed" class="gs-btn gs-dropdown-host">
                  <span class="gs-text-btn">{{ playbackRate.toFixed(1) }}x</span>
                  <div class="gs-dropdown">
                    <div
                        v-for="rate in props.playbackRates"
                        :key="rate"
                        class="gs-dropdown-item"
                        :class="{ active: rate === playbackRate }"
                        @click.stop="setPlaybackRate(rate)"
                    >
                      {{ rate.toFixed(1) }}x
                    </div>
                  </div>
                </div>

                <!-- 音量 -->
                <div v-if="controlsVisibility.volume" class="gs-btn gs-dropdown-host" @click.stop="toggleMute"
                     @mouseenter="bindWheel" @mouseleave="unbindWheel">
                  <svg viewBox="0 0 24 24" style="transform: scale(0.95);">
                    <path v-if="isMuted || volume === 0" fill="currentColor"
                          d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    <path v-else fill="currentColor"
                          d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>

                  <div class="gs-dropdown gs-volume-panel" @click.stop>
                    <div class="gs-volume-val">{{ Math.round(volume * 100) }}%</div>
                    <div class="gs-volume-slider" @mousedown="handleVolumeSliderClick">
                      <div class="gs-volume-track">
                        <div class="gs-volume-fill" :style="{ height: `${volume * 100}%` }"></div>
                        <div class="gs-volume-handle" :style="{ bottom: `${volume * 100}%` }"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 网页全屏 -->
                <div v-if="controlsVisibility.fullscreen" class="gs-btn gs-dropdown-host" @click.stop="webFullscreen">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                       stroke-linecap="round" stroke-linejoin="round"
                       style="transform: scale(0.8);">
                    <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
                    <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                    <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
                    <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                    <rect width="10" height="8" x="7" y="8" rx="1"/>
                  </svg>
                  <div class="gs-dropdown">
                    <div class="gs-dropdown-item" @click.stop="fullscreen">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                           style="transform: scale(0.8);">
                        <path d="m15 15 6 6"/>
                        <path d="m15 9 6-6"/>
                        <path d="M21 16v5h-5"/>
                        <path d="M21 8V3h-5"/>
                        <path d="M3 16v5h5"/>
                        <path d="m3 21 6-6"/>
                        <path d="M3 8V3h5"/>
                        <path d="M9 9 3 3"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </slot>
        </footer>
      </slot>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, ref} from 'vue';
import Player from '../core/Player.vue';
import {ControlType, ControlTypes, IGsPlayerExpose, IGsPlayerProps, IPlayerExpose, PlayerSource} from '../types';

const props = withDefaults(defineProps<IGsPlayerProps>(), {
  showControls: true,
  showError: true,
  errorMessage: '请求错误',
  handleClick: true,
  handleDblClick: true,
  playbackRates: () => [0.5, 0.8, 1.0, 1.2, 1.5, 2.0],
  visibleControls: () => [...ControlTypes],
  hiddenControls: () => [],
  webFullscreenTarget: 'body'
});

const emit = defineEmits<{ (e: 'srcChange', src: PlayerSource): void }>();

// Refs
const playerRef = ref() as { value: IPlayerExpose };
const playerContainerRef = ref<HTMLDivElement>();

// State
const error = ref(false);
const isPlaying = ref(false);
const isMuted = ref(false);
const isWebFullscreen = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const playbackRate = ref(1);

// 进度条与音量
const showProgressTooltip = ref(false);
const tooltipPosition = ref(0);
const tooltipTime = ref(0);
const volume = ref(1);
const previousVolume = ref(1);

// 工具函数：限制范围，去重
const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

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
    progress: isVisible('progress')
  };
});

const progress = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0);

// 插槽属性
const progressSlotProps = computed(() => ({
  progress: progress.value,
  currentTime: currentTime.value,
  duration: duration.value,
  handleProgressClick,
  handleProgressMouseMove,
  handleProgressMouseLeave
}));

const slotProps = computed(() => ({
  ...progressSlotProps.value,
  isPlaying: isPlaying.value,
  isMuted: isMuted.value,
  isWebFullscreen: isWebFullscreen.value,
  playbackRate: playbackRate.value,
  volume: volume.value,
  controlsVisibility: controlsVisibility.value,
  togglePlay,
  play,
  pause,
  unmute,
  toggleMute,
  setVolume,
  setPlaybackRate,
  switchToPreSrc,
  switchToNextSrc,
  fullscreen,
  webFullscreen,
  formatTime
}));

// Methods
const handleError = () => (error.value = true);
const handleTimeUpdate = (e: Event) => (currentTime.value = (e.target as HTMLVideoElement).currentTime);
const handleLoadedMetadata = (e: Event) => (duration.value = (e.target as HTMLVideoElement).duration);

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

// 进度条交互
const getProgressRatio = (e: MouseEvent, el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return clamp((e.clientX - rect.left) / rect.width, 0, 1);
};

const handleProgressClick = (e: MouseEvent) => {
  const newTime = getProgressRatio(e, e.currentTarget as HTMLElement) * duration.value;
  if (playerRef.value?.el) playerRef.value.el.currentTime = newTime;
};

const handleProgressMouseMove = (e: MouseEvent) => {
  const ratio = getProgressRatio(e, e.currentTarget as HTMLElement);
  showProgressTooltip.value = true;
  tooltipPosition.value = clamp(ratio * 100, 5, 95);
  tooltipTime.value = ratio * duration.value;
};

const handleProgressMouseLeave = () => (showProgressTooltip.value = false);

// 播放控制
const togglePlay = async () => await playerRef.value?.togglePlay();
const play = async (src?: any) => await playerRef.value?.play(src);
const pause = async () => await playerRef.value?.pause();
const unmute = async () => {
  isMuted.value = false;
  await playerRef.value?.unmute();
};
const switchToNextSrc = () => playerRef.value?.play(props.nextSrc);
const switchToPreSrc = () => playerRef.value?.play(props.preSrc);

// 音量控制
const setVolume = (newVol: number) => {
  volume.value = clamp(newVol, 0, 1);
  if (playerRef.value?.el) {
    playerRef.value.el.volume = volume.value;
    isMuted.value = volume.value === 0;
    playerRef.value.el.muted = isMuted.value;
  }
};

const toggleMute = () => {
  if (volume.value > 0) {
    previousVolume.value = volume.value;
    setVolume(0);
  } else {
    setVolume(previousVolume.value || 0.5); // 恢复或默认 0.5
  }
};

const handleVolumeSliderClick = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  setVolume((rect.bottom - e.clientY) / rect.height);
};

const handleVolumeWheel = (e: WheelEvent) => {
  e.preventDefault();
  setVolume(volume.value + (e.deltaY > 0 ? -0.1 : 0.1));
};

const bindWheel = () => document.addEventListener('wheel', handleVolumeWheel, {passive: false});
const unbindWheel = () => document.removeEventListener('wheel', handleVolumeWheel);

// 其他设置
const setPlaybackRate = (rate: number) => {
  playbackRate.value = rate;
  if (playerRef.value?.el) playerRef.value.el.playbackRate = rate;
};

const fullscreen = () => {
  const el = playerContainerRef.value;
  if (!document.fullscreenElement && el) el.requestFullscreen().catch(console.error);
  else if (document.exitFullscreen) document.exitFullscreen();
};

const webFullscreen = () => (isWebFullscreen.value = !isWebFullscreen.value);

const handlePlayerClick = () => props.handleClick && (isMuted.value ? toggleMute() : togglePlay());
const handlePlayerDblClick = () => {
  if (!props.handleDblClick) return;
  if (document.fullscreenElement) document.exitFullscreen();
  else if (isWebFullscreen.value) isWebFullscreen.value = false;
  else webFullscreen();
};

// Lifecycle
onBeforeUnmount(() => {
  unbindWheel();
});

defineExpose<IGsPlayerExpose>({
  get el() {
    return playerRef.value?.el;
  },
  get player() {
    return playerRef.value?.el;
  },
  play, pause, togglePlay, unmute, setVolume, setPlaybackRate, fullscreen, webFullscreen
});
</script>
