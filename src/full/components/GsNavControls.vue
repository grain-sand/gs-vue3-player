<template>
  <!-- 上一个按钮 -->
  <div
    v-if="player.controlsVisibility.pre && hasPreSource"
    class="gs-btn"
    @click.stop="player.playPre"
    :title="player.i18n.titles.pre"
  >
    <PreSvg />
  </div>

  <!-- 播放/暂停按钮 -->
  <div
    v-if="player.controlsVisibility.play"
    class="gs-btn"
    @click.stop="player.togglePlay"
    :title="player.i18n.titles.play"
  >
    <component :is="PlayStateIcons[player.isPlaying.toString()]"/>
  </div>

  <!-- 下一个按钮 -->
  <div
    v-if="player.controlsVisibility.next && hasNextSource"
    class="gs-btn"
    @click.stop="player.playNext"
    :title="player.i18n.titles.next"
  >
    <NextSvg />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { PreSvg, NextSvg, PlayStateIcons } from '../../svgs';
import { PlayerInjectKey } from '../types/PlayerInject';

import type { PlayerInject } from '../types/PlayerInject';

const player = inject<PlayerInject>(PlayerInjectKey)!;

const hasPreSource = computed(() => {
  return player.preSrc || (player.playlist && player.playlist.length > 0);
});

const hasNextSource = computed(() => {
  return player.nextSrc || (player.playlist && player.playlist.length > 0);
});
</script>
