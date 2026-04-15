<template>
  <div v-if="player.controlsVisibility.time" class="gs-time-display" :title="title">
    {{ time }}
  </div>
</template>

<script setup lang="ts">
import {computed, inject} from "vue";
import type {PlayerInject} from '../types/PlayerInject';
import {PlayerInjectKey} from '../types/PlayerInject';
import {formatTime} from "../../util";

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
</script>
