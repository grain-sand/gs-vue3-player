<template>
  <div v-if="player.controlsVisibility.time" class="gs-time-display" :title="title">
    {{ time }}
  </div>
</template>

<script setup lang="ts">
import {computed, inject} from "vue";
import type {IPlayerInject} from '../types/IPlayerInject';
import {PlayerInjectKey} from '../types/IPlayerInject';
import {formatTime} from "../../util";

const player = inject<IPlayerInject>(PlayerInjectKey)!;

const time = computed(() => {
  return `${formatTime(player.playerRef.value?.time || 0)}/${formatTime(player.playerRef.value?.duration || 0)}`;
});

const title = computed(() => {
  if (player.props.playlist && player.props.playlist.length > 0) {
    const currentPosition = player.currentIndex + 1;
    const totalCount = player.props.playlist.length;
    return `${currentPosition}/${totalCount}`;
  }
  return '';
});
</script>
