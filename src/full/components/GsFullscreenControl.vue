<template>
  <!-- 弹出小窗按钮 - 控制面板模式 -->
  <div v-if="player.props.fullscreenButtonMode === 'control' && isPipSupported && player.controlsVisibility.fullscreen"
       class="gs-btn"
       @click.stop="pip" :title="player.props.i18n.titles.pip">
    <PipSvg style="transform: scale(0.8);"/>
  </div>
  <div v-if="player.controlsVisibility.fullscreen" class="gs-btn gs-dropdown-host"
       @click.stop="player.isWebFullscreen.value=!player.isWebFullscreen.value"
       :title="player.props.i18n.titles.webFullscreen">
    <WebFullscreenSvg style="transform: scale(0.8);"/>
    <div class="gs-dropdown" v-if="player.props.fullscreenButtonMode === 'submenu'">
      <div class="gs-dropdown-item" @click.stop="fullscreen" :title="player.props.i18n.titles.fullscreen">
        <FullscreenSvg style="transform: scale(0.8);"/>
      </div>
      <div v-if="isPipSupported" class="gs-dropdown-item" @click.stop="pip" :title="player.props.i18n.titles.pip">
        <PipSvg style="transform: scale(0.8);"/>
      </div>
    </div>
  </div>
  <!-- 全屏按钮 - 控制面板模式 -->
  <div v-if="player.props.fullscreenButtonMode === 'control' && player.controlsVisibility.fullscreen" class="gs-btn"
       @click.stop="fullscreen" :title="player.props.i18n.titles.fullscreen">
    <FullscreenSvg style="transform: scale(0.8);"/>
  </div>
</template>

<script setup lang="ts">
import {inject, ref, onMounted} from 'vue';
import {FullscreenSvg, WebFullscreenSvg, PipSvg} from '../../svgs';
import {PlayerInjectKey} from '../types/IPlayerInject';

import type {IPlayerInject} from '../types/IPlayerInject';

const player = inject<IPlayerInject>(PlayerInjectKey)!;

const isPipSupported = ref(false);

onMounted(() => {
  isPipSupported.value = document.pictureInPictureEnabled;
});

const fullscreen = () => {
  const el = player.playerRef.value?.el;
  if (!el) return;

  if (!document.fullscreenElement) {
    el.requestFullscreen().catch(err => {
      console.error('Error attempting to enable fullscreen:', err);
    });
  } else {
    document.exitFullscreen().catch(err => {
      console.error('Error attempting to exit fullscreen:', err);
    });
  }
};


const pip = async () => {
  const video = player.playerRef.value?.el;
  if (!video) return;

  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await video.requestPictureInPicture();
    }
  } catch (error) {
    console.error('Error toggling Picture-in-Picture:', error);
  }
};
</script>
