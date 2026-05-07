<template>
  <div
      v-show="core?.muted||!core?.playing"
      class="gs-player-play-overlay"
      :class="{ 'muted': core?.playing && core?.muted }"
      @click.stop.prevent="core.unmute().then(() => core.play())"
  >
    <div class="gs-play-overlay-button">
      <PauseSvg v-if="!core?.playing"/>
      <MuteSvg v-else-if="core?.muted"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PauseSvg, MuteSvg} from '../../../svgs';
import {IGsWidgetProps} from '../../../type';

defineProps<IGsWidgetProps>();
</script>
