<template>
  <Teleport to="body" :disabled="!isWebFullscreen">
    <div class="gs-player" :class="{ 'gs-player-web-fullscreen': isWebFullscreen }" ref="playerContainerRef" @click="handlePlayerClick" @dblclick="handlePlayerDblClick">
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
          @srcChange="emit('srcChange', $event)"
          v-bind="$attrs"
      />

      <!-- 错误信息 -->
      <div v-if="props.showError && error" class="gs-player-error">
        {{ props.errorMessage || '请求错误' }}
      </div>

      <!-- 底部控制区域 -->
      <footer v-if="props.showControls" class="gs-player-footer">
        <!-- 进度条 -->
        <div class="gs-player-progress-container">
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
        <div class="gs-player-controls">
          <!-- 播放/暂停按钮 -->
          <div v-if="isButtonVisible('play')" :class="{'gs-player-play-btn': true,isPlaying}" @click.stop="togglePlay">
            <span>
              {{ isPlaying ? '⏸' : '▶' }}
            </span>
          </div>

          <!-- 下一个按钮 -->
          <div v-if="isButtonVisible('next') && nextSrc" class="gs-player-next-btn" @click.stop="switchToNextSrc">
            <span>
              ⏭
            </span>
          </div>

          <!-- 时间显示 -->
          <div class="gs-player-time">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </div>

          <!-- 右侧控制按钮 -->
          <div class="gs-player-right-controls">
            <!-- 倍速按钮 -->
            <div v-if="isButtonVisible('speed')" class="gs-player-speed-btn">
              {{ playbackRate === 1 ? '1.0' : playbackRate === 2 ? '2.0' : playbackRate }}
              <div class="gs-player-dropdown">
                <div
                    v-for="rate in props.playbackRates"
                    :key="rate"
                    class="gs-player-dropdown-option"
                    :class="{ active: rate === playbackRate }"
                    @click.stop="setPlaybackRate(rate)"
                >
                  {{ rate === 1 ? '1.0' : rate === 2 ? '2.0' : rate }}
                </div>
              </div>
            </div>

            <!-- 音量按钮 -->
            <div v-if="isButtonVisible('volume')" class="gs-player-volume-btn" @click="toggleMute" @mouseenter="handleVolumeMouseEnter"
                 @mouseleave="handleVolumeMouseLeave">
              {{ isMuted ? '🔇' : '🔊' }}
              <!-- 音量滑块 -->
              <div class="gs-player-dropdown" @click.stop>
                <div class="gs-player-slider-label">{{ Math.round(volume * 100) }}%</div>
                <div class="gs-player-slider-wrapper" @click="handleVolumeSliderClick">
                  <div class="gs-player-slider">
                    <div
                        class="gs-player-slider-fill"
                        :style="{ height: `${volume * 100}%` }"
                    ></div>
                    <div
                        class="gs-player-slider-handle"
                        :style="{ bottom: `${volume * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 网页全屏按钮 -->
            <div v-if="isButtonVisible('fullscreen')" class="gs-player-web-fullscreen-btn" @click.stop="webFullscreen">
              ⛶
              <div class="gs-player-dropdown">
                <div class="gs-player-dropdown-option" @click.stop="fullscreen">
                  <span class="fullscreen-icon">
                    <span>
                      ←→
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from 'vue';
import Player from '../core/Player.vue';
import type {IGsPlayerExpose, IGsPlayerProps, IPlayerExpose, PlayerSource} from '../types';


// Props
const props = withDefaults(defineProps<IGsPlayerProps>(), {
  showControls: true,
  showError: true,
  errorMessage: '请求错误',
  handleClick: true,
  handleDblClick: true,
  playbackRates: () => [0.5, 0.8, 1, 1.2, 1.5, 2],
  showButtons: () => [],
  hideButtons: () => []
});

// Emits
const emit = defineEmits<{
  (e: 'srcChange', src: PlayerSource): void;
}>();

// Refs
const playerRef = ref<InstanceType<typeof Player>>() as { value: IPlayerExpose };
const playerContainerRef = ref<HTMLDivElement>();

// State
const error = ref(false);
const isPlaying = ref(false);
const isMuted = ref(false);
const isFullscreen = ref(false);
const isWebFullscreen = ref(false);
const showSpeedDropdown = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const playbackRate = ref<number>(1);
// 进度条提示相关
const showProgressTooltip = ref(false);
const tooltipPosition = ref(0);
const tooltipTime = ref(0);
// 音量滑块相关
const volume = ref(1);
const previousVolume = ref(1);

// Computed
const isButtonVisible = (buttonName: string) => {
  // 排除优先级更高
  if (props.hideButtons.includes(buttonName)) {
    return false;
  }
  // 如果没有指定显示的按钮，默认全部显示
  if (props.showButtons.length === 0) {
    return true;
  }
  // 否则，只显示指定的按钮
  return props.showButtons.includes(buttonName);
};

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
  // 确保时间提示的位置不会超出播放器的范围，限制在 5% 到 95% 之间
  tooltipPosition.value = Math.max(5, Math.min(95, percentage * 100));
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
    if (!isMuted.value) {
      // 静音时，保存当前音量并设置显示为 0
      previousVolume.value = volume.value;
      volume.value = 0;
    } else {
      // 取消静音时，恢复之前的音量
      volume.value = previousVolume.value;
    }
    playerRef.value.el.muted = !isMuted.value;
    isMuted.value = !isMuted.value;
  }
}

function setVolume(newVolume: number) {
  const clampedVolume = Math.max(0, Math.min(1, newVolume));
  volume.value = clampedVolume;
  if (playerRef.value?.el) {
    playerRef.value.el.volume = clampedVolume;
    // 如果音量不为0，确保取消静音
    if (clampedVolume > 0) {
      playerRef.value.el.muted = false;
      isMuted.value = false;
    }
  }
}

function handleVolumeSliderClick(event: MouseEvent) {
  const slider = event.currentTarget as HTMLElement;
  const rect = slider.getBoundingClientRect();
  const offsetY = rect.bottom - event.clientY;
  const percentage = Math.max(0, Math.min(1, offsetY / rect.height));
  setVolume(percentage);
}

function handleVolumeWheel(event: WheelEvent) {
  event.preventDefault();
  const delta = event.deltaY > 0 ? -0.15 : 0.15;
  const newVolume = Math.max(0, Math.min(1, volume.value + delta));
  setVolume(newVolume);
}

function handleVolumeMouseEnter() {
  // 注册鼠标滚轮事件
  document.addEventListener('wheel', handleVolumeWheel, {passive: false});
}

function handleVolumeMouseLeave() {
  // 取消鼠标滚轮事件
  document.removeEventListener('wheel', handleVolumeWheel);
}


function setPlaybackRate(rate: number) {
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
  isWebFullscreen.value = !isWebFullscreen.value;
}

function switchToNextSrc() {
  playerRef.value?.play(props.nextSrc);
}

function handlePlayerClick() {
  if (props.handleClick) {
    if (isMuted.value) {
      // 静音时，取消静音
      toggleMute();
    } else {
      // 否则，切换播放/暂停
      togglePlay();
    }
  }
}

function handlePlayerDblClick() {
  if (props.handleDblClick) {
    if (document.fullscreenElement) {
      // 在任意全屏状态，退出全屏
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else if (isWebFullscreen.value) {
      // 在网页全屏状态，退出网页全屏
      isWebFullscreen.value = false;
    } else {
      // 在常规状态，切换到网页全屏
      webFullscreen();
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
