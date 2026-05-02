<template>
  <div class="gs-progress-container"
       @click.stop="handleProgressClick"
       @mousemove="handleProgressMouseMove"
       @mouseleave="showProgressTooltip = false">
    <div class="gs-progress-bar">
      <div class="gs-progress-track">
        <div class="gs-progress-buffered" :style="{ width: bufferedPercent + '%' }"/>
        <div class="gs-progress-fill" :style="{ width: progress + '%' }"></div>
        <div class="gs-progress-handle" :style="{ left: `${progress}%` }"></div>
        <div v-show="showProgressTooltip" class="gs-progress-tooltip" :style="{ left: `${tooltipPosition}%` }">
          {{ formatTime(tooltipTime) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {IGsProgressBarEmits, IGsProgressBarProps} from '../type';

const props = defineProps<IGsProgressBarProps>();

const emit = defineEmits<IGsProgressBarEmits>();

const showProgressTooltip = ref(false);
const tooltipPosition = ref(0);
const tooltipTime = ref(0);

const progress = computed(() => {
  const duration = props.duration ?? 0;
  return duration ? (props.time / duration) * 100 : 0;
});

const bufferedPercent = computed(() => {
  const duration = props.duration ?? 0;
  const buffered = props.buffered;
  if (!duration || !buffered || buffered.length === 0) return 0;
  return (buffered.end(buffered.length - 1) / duration) * 100;
});

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const getProgressRatio = (e: MouseEvent, el: HTMLElement) => {
  return clamp((e.clientX - el.getBoundingClientRect().left) / el.getBoundingClientRect().width, 0, 1);
};

const handleProgressClick = (e: MouseEvent) => {
  // @ts-ignore
  emit('seek', getProgressRatio(e, e.currentTarget as HTMLElement) * (props.duration || 0));
};

const handleProgressMouseMove = (e: MouseEvent) => {
  const ratio = getProgressRatio(e, e.currentTarget as HTMLElement);
  showProgressTooltip.value = true;
  tooltipPosition.value = clamp(ratio * 100, 5, 95);
  tooltipTime.value = ratio * (props.duration || 0);
};
</script>
