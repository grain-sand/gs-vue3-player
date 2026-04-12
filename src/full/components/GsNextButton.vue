<template>
  <div v-if="controlsVisibility.next && (nextSrc||playlist?.[currentIndex+1])"
       class="gs-btn" @click.stop="switchToNextSrc" :title="i18n.titles.next">
    <NextSvg/>
  </div>
</template>

<script setup lang="ts">
import { NextSvg } from '../svgs';
import type { PlayerSource } from '../../types';

interface Props {
  controlsVisibility: {
    next: boolean;
  };
  nextSrc?: PlayerSource;
  playlist?: PlayerSource[];
  currentIndex: number;
  i18n: {
    titles: {
      next: string;
    };
  };
  switchToNextSrc: () => void;
}

const props = defineProps<Props>();
</script>
