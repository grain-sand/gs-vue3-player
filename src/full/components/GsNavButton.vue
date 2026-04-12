<template>
  <div
    v-if="controlsVisibility[type] && hasSource"
    class="gs-btn"
    @click.stop="onClick"
    :title="i18n.titles[type]"
  >
    <component :is="icon" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PreSvg } from '../svgs';
import { NextSvg } from '../svgs';
import type { PlayerSource } from '../../types';

interface Props {
  type: 'pre' | 'next';
  controlsVisibility: {
    pre: boolean;
    next: boolean;
  };
  preSrc?: PlayerSource;
  nextSrc?: PlayerSource;
  playlist?: PlayerSource[];
  currentIndex: number;
  i18n: {
    titles: {
      pre: string;
      next: string;
    };
  };
  switchToPreSrc: () => void;
  switchToNextSrc: () => void;
}

const props = defineProps<Props>();

const icon = computed(() => props.type === 'pre' ? PreSvg : NextSvg);

const hasSource = computed(() => {
  if (props.type === 'pre') {
    return props.preSrc || (props.playlist && props.playlist[props.currentIndex - 1]);
  } else {
    return props.nextSrc || (props.playlist && props.playlist[props.currentIndex + 1]);
  }
});

const onClick = () => {
  if (props.type === 'pre') {
    props.switchToPreSrc();
  } else {
    props.switchToNextSrc();
  }
};
</script>
