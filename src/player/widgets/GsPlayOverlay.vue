<template>
  <div v-show="!isPlaying" class="gs-player-play-overlay" :class="{ 'muted': isMuted }">
    <div class="gs-play-overlay-button">
      <component :is="PlayStateIcons['false']"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {PlayStateIcons} from '../../svgs';
import {IGsWidgetProps} from '../../type';

const props = defineProps<IGsWidgetProps>();

const isPlaying = computed(() => props.core?.playing ?? false);
const isMuted = computed(() => props.core?.muted ?? false);
</script>
