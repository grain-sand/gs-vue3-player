<template>
  <div v-if="player.controlsVisibility.time" class="gs-time-display" :title="title">
    {{ time }}
  </div>
</template>

<script setup lang="ts">
import {computed, inject} from "vue";
import {PlayerInjectKey} from '../types/PlayerInject';

import type { PlayerInject } from '../types/PlayerInject';

const player = inject<PlayerInject>(PlayerInjectKey)!;

const time = computed(() => {
  return `${formatTime(player.currentTime)}/${formatTime(player.duration)}`;
});

const title = computed(() => {
  if (player.playlist && player.playlist.length > 0) {
    const currentPosition = player.currentIndex + 1;
    const totalCount = player.playlist.length;
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
