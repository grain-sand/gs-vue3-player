<template>
  <div class="gs-time-display">
    <span>{{ formatTime(currentTime) }}</span>
    <span v-if="showDuration"> / {{ formatTime(duration) }}</span>
  </div>
</template>

<script setup lang="ts">
import {formatTime} from "../../util";

interface Props {
  currentTime: number;
  duration: number;
  showDuration?: boolean;
}

withDefaults(defineProps<Props>(), {
  showDuration: true
});
</script>
