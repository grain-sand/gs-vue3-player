<template>
  <div class="gs-progress-container">
    <div class="gs-progress-bar" @click="handleClick">
      <div class="gs-progress-track">
        <div class="gs-progress-buffered" :style="{ width: bufferedPercent + '%' }"/>
        <div class="gs-progress-fill" :style="{ width: percent + '%' }"/>
        <div class="gs-progress-handle" :style="{ left: percent + '%' }"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';

interface Props {
  currentTime: number;
  duration: number;
  buffered?: number;
}

const props = withDefaults(defineProps<Props>(), {
  buffered: 0
});

const emit = defineEmits<{
  (e: 'seek', time: number): void
}>();

const percent = computed(() => {
  if (!props.duration) return 0;
  return Math.min(100, (props.currentTime / props.duration) * 100);
});

const bufferedPercent = computed(() => {
  if (!props.duration) return 0;
  return Math.min(100, (props.buffered / props.duration) * 100);
});

const handleClick = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const clickPercent = x / rect.width;
  const time = clickPercent * props.duration;
  emit('seek', time);
};
</script>
