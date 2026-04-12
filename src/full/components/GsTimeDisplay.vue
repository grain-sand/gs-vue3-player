<template>
  <div v-if="controlsVisibility.time" class="gs-time-display">
    {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  controlsVisibility: {
    time: boolean;
  };
  currentTime: number;
  duration: number;
}

const props = defineProps<Props>();

// 格式化时间
const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};
</script>
