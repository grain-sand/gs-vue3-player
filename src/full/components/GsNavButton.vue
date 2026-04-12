<template>
  <div
    v-if="player.controlsVisibility[type] && hasSource"
    class="gs-btn"
    @click.stop="onClick"
    :title="player.i18n.titles[type]"
  >
    <component :is="icon" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { PreSvg } from '../svgs';
import { NextSvg } from '../svgs';
import { PlayerInjectKey } from '../types/PlayerInject';

interface Props {
  type: 'pre' | 'next';
}

const props = defineProps<Props>();
import type { PlayerInject } from '../types/PlayerInject';

const player = inject<PlayerInject>(PlayerInjectKey)!;

const icon = computed(() => props.type === 'pre' ? PreSvg : NextSvg);

const hasSource = computed(() => {
  if (props.type === 'pre') {
    return player.preSrc || (player.playlist && player.playlist[player.currentIndex - 1]);
  } else {
    return player.nextSrc || (player.playlist && player.playlist[player.currentIndex + 1]);
  }
});

const onClick = () => {
  if (props.type === 'pre') {
    player.switchToPreSrc();
  } else {
    player.switchToNextSrc();
  }
};
</script>
