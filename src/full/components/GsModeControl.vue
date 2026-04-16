<template>
  <div v-if="player.controlsVisibility.play" class="gs-btn gs-dropdown-host"
       :title="player.props.i18n.playbackModes[player.currentMode]">
    <component :is="PlaybackModeIcons[player.currentMode]"
               :style="{ transform: `scale(0.${player.currentMode === 'disabled' ? '73' : '82' })` }"/>
    <div class="gs-dropdown">
      <div
          v-for="mode in player.availableModes"
          :key="mode.value"
          class="gs-dropdown-item"
          :class="{ active: mode.value === player.currentMode }"
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
import { PlaybackModeIcons } from '../../svgs';
import { PlayerInjectKey } from '../types/IPlayerInject';

import type { IPlayerInject } from '../types/IPlayerInject';

const player = inject<IPlayerInject>(PlayerInjectKey)!;
</script>
