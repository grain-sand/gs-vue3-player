<template>
  <div v-if="player.controlsVisibility.play" class="gs-btn" @click.stop="player.togglePlay"
       :title="player.i18n.titles.play">
    <component :is="PlayStateIcons[player.isPlaying.toString()]"/>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { PlayStateIcons } from '../svgs';
import { PlayerInjectKey } from '../types/PlayerInject';

import type { PlayerInject } from '../types/PlayerInject';

const player = inject<PlayerInject>(PlayerInjectKey)!;
</script>
