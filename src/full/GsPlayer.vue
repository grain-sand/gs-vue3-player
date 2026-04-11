<template>
  <div class="gs-player" ref="playerContainerRef">
    <Player
      ref="playerRef"
      :src="props.src"
      :hls-config="props.hlsConfig"
      :quality="props.quality"
      :use-browser-hls="props.useBrowserHls"
      @error="handleError"
      @play="handlePlay"
      @pause="handlePause"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
    />

    <!-- 错误信息 -->
    <div v-if="props.showError && error" class="gs-player-error">
      {{ props.errorMessage || '请求错误' }}
    </div>

    <!-- 进度条 -->
    <div v-if="props.showControls" class="gs-player-progress-container">
      <div
        class="gs-player-progress"
        @click="handleProgressClick"
        @mousemove="handleProgressMouseMove"
        @mouseleave="handleProgressMouseLeave"
      >
        <div
          class="gs-player-progress-fill"
          :style="{ width: `${progress}%` }"
        ></div>
        <div
          class="gs-player-progress-handle"
          :style="{ left: `${progress}%` }"
        ></div>
        <!-- 时间提示 -->
        <div
          v-if="showProgressTooltip"
          class="gs-player-progress-tooltip"
          :style="{ left: `${tooltipPosition}%` }"
        >
          {{ formatTime(tooltipTime) }}
        </div>
      </div>
    </div>

    <!-- 控制面板 -->
    <div v-if="props.showControls" class="gs-player-controls">
      <!-- 播放/暂停按钮 -->
      <div class="gs-player-play-btn" @click="togglePlay">
        {{ isPlaying ? '⏸' : '▶' }}
      </div>

      <!-- 时间显示 -->
      <div class="gs-player-time">
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </div>

      <!-- 右侧控制按钮 -->
      <div class="gs-player-right-controls">
        <!-- 倍速按钮 -->
        <div class="gs-player-speed-btn" @click="toggleSpeedDropdown">
          倍速
          <div class="gs-player-speed-dropdown" :class="{ show: showSpeedDropdown }">
            <div
              v-for="rate in playbackRates"
              :key="rate"
              class="gs-player-speed-option"
              :class="{ active: rate === playbackRate }"
              @click="setPlaybackRate(rate)"
            >
              {{ rate }}x
            </div>
          </div>
        </div>

        <!-- 音量按钮 -->
        <div class="gs-player-volume-btn" @click="toggleMute">
          {{ isMuted ? '🔇' : '🔊' }}
        </div>

        <!-- 网页全屏按钮 -->
        <div class="gs-player-web-fullscreen-btn" @click="webFullscreen">
          ⛶
        </div>

        <!-- 全屏按钮 -->
        <div class="gs-player-fullscreen-btn" @click="fullscreen">
          ⛶
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from 'vue';
import Player from '../core/Player.vue';
import type {IGsPlayerExpose, IGsPlayerProps, IPlayerExpose, PlaybackRate} from '../types';


// Props
const props = withDefaults(defineProps<IGsPlayerProps>(), {
  showControls: true,
  showError: true,
  errorMessage: '请求错误'
});

// Refs
const playerRef = ref<InstanceType<typeof Player>>() as { value: IPlayerExpose };
const playerContainerRef = ref<HTMLDivElement>();

// State
const error = ref(false);
const isPlaying = ref(false);
const isMuted = ref(false);
const isFullscreen = ref(false);
const showSpeedDropdown = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const playbackRate = ref<PlaybackRate>(1);
const playbackRates: PlaybackRate[] = [0.5, 0.75, 1, 1.25, 1.5, 2];
// 进度条提示相关
const showProgressTooltip = ref(false);
const tooltipPosition = ref(0);
const tooltipTime = ref(0);

// Computed
const progress = computed(() => {
  if (!duration.value) return 0;
  return (currentTime.value / duration.value) * 100;
});

// Methods
function handleError() {
  error.value = true;
}

function handlePlay() {
  isPlaying.value = true;
}

function handlePause() {
  isPlaying.value = false;
}

function handleTimeUpdate(event: Event) {
  const video = event.target as HTMLVideoElement;
  currentTime.value = video.currentTime;
}

function handleLoadedMetadata(event: Event) {
  const video = event.target as HTMLVideoElement;
  duration.value = video.duration;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function handleProgressClick(event: MouseEvent) {
  const progressBar = event.currentTarget as HTMLElement;
  const rect = progressBar.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const percentage = offsetX / rect.width;
  const newTime = percentage * duration.value;

  if (playerRef.value?.el) {
    playerRef.value.el.currentTime = newTime;
  }
}

function handleProgressMouseMove(event: MouseEvent) {
  const progressBar = event.currentTarget as HTMLElement;
  const rect = progressBar.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
  const time = percentage * duration.value;

  showProgressTooltip.value = true;
  tooltipPosition.value = percentage * 100;
  tooltipTime.value = time;
}

function handleProgressMouseLeave() {
  showProgressTooltip.value = false;
}

async function togglePlay() {
  await playerRef.value?.togglePlay();
}

async function play(src?: any) {
  await playerRef.value?.play(src);
}

async function pause() {
  await playerRef.value?.pause();
}

async function unmute() {
  await playerRef.value?.unmute();
  isMuted.value = false;
}

function toggleMute() {
  if (playerRef.value?.el) {
    playerRef.value.el.muted = !isMuted.value;
    isMuted.value = !isMuted.value;
  }
}

function setVolume(volume: number) {
  if (playerRef.value?.el) {
    playerRef.value.el.volume = Math.max(0, Math.min(1, volume));
  }
}

function toggleSpeedDropdown() {
  showSpeedDropdown.value = !showSpeedDropdown.value;
}

function setPlaybackRate(rate: PlaybackRate) {
  playbackRate.value = rate;
  if (playerRef.value?.el) {
    playerRef.value.el.playbackRate = rate;
  }
  showSpeedDropdown.value = false;
}

function fullscreen() {
  if (playerContainerRef.value) {
    if (!document.fullscreenElement) {
      playerContainerRef.value.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
}

function webFullscreen() {
  if (playerContainerRef.value) {
    if (!document.fullscreenElement) {
      playerContainerRef.value.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
}

// Lifecycle
onMounted(() => {
  // 监听全屏变化
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement;
  });

  // 点击外部关闭倍速下拉菜单
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.gs-player-speed-btn')) {
      showSpeedDropdown.value = false;
    }
  });
});

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement;
  });

  document.removeEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.gs-player-speed-btn')) {
      showSpeedDropdown.value = false;
    }
  });
});

// Expose
defineExpose<IGsPlayerExpose>({
  get el() {
    return playerRef.value?.el;
  },
  get player() {
    return playerRef.value?.el;
  },
  play,
  pause,
  togglePlay,
  unmute,
  setVolume,
  setPlaybackRate,
  fullscreen,
  webFullscreen
});
</script>
