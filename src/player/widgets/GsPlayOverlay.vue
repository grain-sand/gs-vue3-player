<template>
  <div v-show="!core?.playing" class="gs-player-play-overlay" :class="{ 'muted': core?.muted }">
    <div class="gs-play-overlay-button">
      <component :is="PlayStateIcons['false']"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PlayStateIcons} from '../../svgs';
import {IGsWidgetProps} from '../../type';

defineProps<IGsWidgetProps>();
</script>
