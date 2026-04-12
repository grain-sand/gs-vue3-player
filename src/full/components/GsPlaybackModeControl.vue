<template>
  <div v-if="player.controlsVisibility.play" class="gs-btn gs-dropdown-host"
       :title="player.i18n.playbackModes[player.currentPlaybackMode]">
    <component :is="PlaybackModeIcons[player.currentPlaybackMode]"
               :style="{ transform: `scale(0.${player.currentPlaybackMode === 'disabled' ? '73' : '82' })` }"/>
    <div class="gs-dropdown">
      <div
          v-for="mode in player.availablePlaybackModes"
          :key="mode.value"
          class="gs-dropdown-item"
          :class="{ active: mode.value === player.currentPlaybackMode }"
          @click.stop="player.setPlaybackMode(mode.value)"
          :title="mode.text"
      >
        <component :is="PlaybackModeIcons[mode.value]"
                   :style="{ transform: `scale(0.${mode.value === 'disabled' ? '73' : '82' })` }"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { PlaybackModeIcons } from '../svgs';
import { PlayerInjectKey } from '../types/PlayerInject';

import type { PlayerInject } from '../types/PlayerInject';

const player = inject<PlayerInject>(PlayerInjectKey)!;
</script>
