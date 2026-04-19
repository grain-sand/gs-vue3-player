<template>
  <div v-if="api.controlsVisibility.time" class="gs-time-display" :title="title">
    {{ time }}
  </div>
</template>

<script setup lang="ts">
import {computed, inject} from "vue";
import type {IGsPlayerInject} from '../type/IGsPlayerInject';
import {GsPlayerInjectKey} from '../type/IGsPlayerInject';
import {formatTime} from "../../util";

const api = inject<IGsPlayerInject>(GsPlayerInjectKey)!;

const player = computed(() => api.playerRef.value)

const time = computed(() => {
  return `${formatTime(player.value?.time || 0)}/${formatTime(player.value?.duration || 0)}`;
});

const title = computed(() => {
  if (player.value && api.playlist.length > 0) {
    const currentPosition = api.index + 1;
    const totalCount = api.playlist.length;
    return `${currentPosition}/${totalCount}`;
  }
  return '';
});
</script>
