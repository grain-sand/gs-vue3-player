<template>
  <div v-if="controlsVisibility.volume" class="gs-btn gs-dropdown-host" @click.stop="toggleMute"
       @mouseenter="bindWheel" @mouseleave="unbindWheel"
       :title="isMuted || volume === 0 ? i18n.titles.mute : i18n.titles.volume">
    <component :is="VolumeStateIcons[isMuted.toString()]"
               style="transform: scale(0.95);"/>

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
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { VolumeStateIcons } from '../svgs';

interface Props {
  controlsVisibility: {
    volume: boolean;
  };
  i18n: {
    titles: {
      mute: string;
      volume: string;
    };
  };
  playerRef: { value: any } | undefined;
  onVolumeChange?: (volume: number) => void;
}

const props = withDefaults(defineProps<Props>(), {
  playerRef: () => ({ value: undefined }),
  onVolumeChange: () => () => {}
});

// 状态
const volume = ref(1);
const isMuted = ref(false);
const previousVolume = ref(1);

// 监听播放器音量变化
watch(
  () => props.playerRef.value?.el?.volume,
  (newVolume) => {
    if (newVolume !== undefined) {
      volume.value = newVolume;
      isMuted.value = newVolume === 0;
    }
  }
);

// 工具函数：限制范围
const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

// 音量控制
const setVolume = (newVol: number) => {
  volume.value = clamp(newVol, 0, 1);
  if (props.playerRef.value?.el) {
    props.playerRef.value.el.volume = volume.value;
    isMuted.value = volume.value === 0;
    props.playerRef.value.el.muted = isMuted.value;
  }
  props.onVolumeChange?.(volume.value);
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

const bindWheel = () => document.addEventListener('wheel', handleVolumeWheel, { passive: false });
const unbindWheel = () => document.removeEventListener('wheel', handleVolumeWheel);
</script>
