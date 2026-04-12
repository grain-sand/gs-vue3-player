<template>
  <div v-if="controlsVisibility.play" class="gs-btn gs-dropdown-host"
       :title="i18n.playbackModes[currentPlaybackMode]">
    <component :is="PlaybackModeIcons[currentPlaybackMode]"
               :style="{ transform: `scale(0.${currentPlaybackMode === 'disabled' ? '73' : '82' })` }"/>
    <div class="gs-dropdown">
      <div
          v-for="mode in availablePlaybackModes"
          :key="mode.value"
          class="gs-dropdown-item"
          :class="{ active: mode.value === currentPlaybackMode }"
          @click.stop="setPlaybackMode(mode.value)"
          :title="mode.text"
      >
        <component :is="PlaybackModeIcons[mode.value]"
                   :style="{ transform: `scale(0.${mode.value === 'disabled' ? '73' : '82' })` }"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlaybackModeIcons } from '../svgs';
import type { PlaybackMode } from '../../types';

interface Props {
  controlsVisibility: {
    play: boolean;
  };
  currentPlaybackMode: PlaybackMode;
  availablePlaybackModes: Array<{
    value: PlaybackMode;
    text: string;
  }>;
  i18n: {
    playbackModes: Record<PlaybackMode, string>;
  };
  setPlaybackMode: (mode: PlaybackMode) => void;
}

const props = defineProps<Props>();
</script>
