<template>
  <div v-if="controlsVisibility.time" class="gs-time-display" :title="title">
    {{ time }}
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";

interface Props {
  controlsVisibility: {
    time: boolean;
  };
  currentTime: number;
  duration: number;
  listLen?: number
  currentIndex?: number
}

const props = defineProps<Props>();

const time = computed(() => {
  return `${formatTime(props.currentTime)}/${formatTime(props.duration)}`;
});

const title = computed(() => {
  if (props.listLen) {
    const currentPosition = props.currentIndex + 1;
    const totalCount = props.listLen;
    return `${currentPosition}/${totalCount}`;
  }
  return '';
});

// 格式化时间
const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};
</script>
