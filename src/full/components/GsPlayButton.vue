<template>
  <div v-if="controlsVisibility.play" class="gs-btn" @click.stop="togglePlay"
       :title="i18n.titles.play">
    <component :is="PlayStateIcons[isPlaying.toString()]"/>
  </div>
</template>

<script setup lang="ts">
import { PlayStateIcons } from '../svgs';

interface Props {
  isPlaying: boolean;
  controlsVisibility: {
    play: boolean;
  };
  i18n: {
    titles: {
      play: string;
    };
  };
  togglePlay: () => void;
}

const props = defineProps<Props>();
</script>
