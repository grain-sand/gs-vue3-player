<template>
  <div v-if="player.controlsVisibility.play" class="gs-btn gs-dropdown-host"
       :title="player.props.i18n.playbackModes[player.currentMode]">
    <component :is="PlaybackModeIcons[player.currentMode]"
               :style="{ transform: `scale(0.${player.currentMode === 'disabled' ? '73' : '82' })` }"/>
    <div class="gs-dropdown">
      <div
          v-for="mode in availableModes"
          :key="mode.value"
          class="gs-dropdown-item"
          :class="{ active: mode.value === player.currentMode }"
          @click.stop="player.setMode(mode.value)"
          :title="mode.text"
      >
        <component :is="PlaybackModeIcons[mode.value]"
                   :style="{ transform: `scale(0.${mode.value === 'disabled' ? '73' : '82' })` }"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { PlaybackModeIcons } from '../../svgs';
import { PlayerInjectKey } from '../types/IGsPlayerInject';
import type { PlaybackMode } from '../../types';

import type { IGsPlayerInject } from '../types/IGsPlayerInject';

const player = inject<IGsPlayerInject>(PlayerInjectKey)!;

// 可用的播放模式
const availableModes = computed<Array<{
  value: PlaybackMode;
  text: string
}>>(() => {
  const modes: Array<{ value: PlaybackMode; text: string }> = [
    {value: 'sequence', text: player.props.i18n.playbackModes.sequence},
    {value: 'disabled', text: player.props.i18n.playbackModes.disabled},
    {value: 'loop', text: player.props.i18n.playbackModes.loop}
  ];

  // 如果设置了列表，添加全部循环、随机播放和播放后删除
  if (player.props.playlist && player.props.playlist.length > 0) {
    modes.push(
        {value: 'loopAll', text: player.props.i18n.playbackModes.loopAll},
        {value: 'shuffle', text: player.props.i18n.playbackModes.shuffle},
        {value: 'deleteAfterPlay', text: player.props.i18n.playbackModes.deleteAfterPlay}
    );
  }

  return modes;
});
</script>
