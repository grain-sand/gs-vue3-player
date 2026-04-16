<template>
  <!-- 弹出小窗按钮 - 控制面板模式 -->
  <div v-if="player.fullscreenButtonMode === 'control' && isPipSupported && player.controlsVisibility.fullscreen" class="gs-btn"
       @click.stop="player.pip" :title="player.i18n.titles.pip">
    <PipSvg style="transform: scale(0.8);"/>
  </div>
  <div v-if="player.controlsVisibility.fullscreen" class="gs-btn gs-dropdown-host" @click.stop="player.webFullscreen"
       :title="player.i18n.titles.webFullscreen">
    <WebFullscreenSvg style="transform: scale(0.8);"/>
    <div class="gs-dropdown" v-if="player.fullscreenButtonMode === 'submenu'">
      <div class="gs-dropdown-item" @click.stop="player.fullscreen" :title="player.i18n.titles.fullscreen">
        <FullscreenSvg style="transform: scale(0.8);"/>
      </div>
      <div v-if="isPipSupported" class="gs-dropdown-item" @click.stop="player.pip" :title="player.i18n.titles.pip">
        <PipSvg style="transform: scale(0.8);"/>
      </div>
    </div>
  </div>
  <!-- 全屏按钮 - 控制面板模式 -->
  <div v-if="player.fullscreenButtonMode === 'control' && player.controlsVisibility.fullscreen" class="gs-btn"
       @click.stop="player.fullscreen" :title="player.i18n.titles.fullscreen">
    <FullscreenSvg style="transform: scale(0.8);"/>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, onMounted } from 'vue';
import {FullscreenSvg, WebFullscreenSvg, PipSvg} from '../../svgs';
import { PlayerInjectKey } from '../types/PlayerInject';

import type { PlayerInject } from '../types/PlayerInject';

const player = inject<PlayerInject>(PlayerInjectKey)!;

const isPipSupported = ref(false);

onMounted(() => {
  isPipSupported.value = document.pictureInPictureEnabled;
});
</script>
