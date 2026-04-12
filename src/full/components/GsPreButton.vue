<template>
  <div v-if="controlsVisibility.pre && (preSrc||playlist?.[currentIndex-1])"
       class="gs-btn" @click.stop="switchToPreSrc" :title="i18n.titles.pre">
    <PreSvg/>
  </div>
</template>

<script setup lang="ts">
import { PreSvg } from '../svgs';
import type { PlayerSource } from '../../types';

interface Props {
  controlsVisibility: {
    pre: boolean;
  };
  preSrc?: PlayerSource;
  playlist?: PlayerSource[];
  currentIndex: number;
  i18n: {
    titles: {
      pre: string;
    };
  };
  switchToPreSrc: () => void;
}

const props = defineProps<Props>();
</script>
