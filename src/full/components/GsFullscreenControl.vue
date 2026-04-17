<template>
  <!-- 弹出小窗按钮 - 控制面板模式 -->
  <div v-if="player.props.fullscreenButtonMode === 'control' && isPipSupported && player.controlsVisibility.fullscreen"
       class="gs-btn"
       @click.stop="pip" :title="player.props.i18n.titles.pip">
    <PipSvg style="transform: scale(0.8);"/>
  </div>
  <div v-if="player.controlsVisibility.fullscreen" class="gs-btn gs-dropdown-host"
       @click.stop="toggleWebFullscreen"
       :title="player.props.i18n.titles.webFullscreen">
    <WebFullscreenSvg style="transform: scale(0.8);"/>
    <div class="gs-dropdown" v-if="player.props.fullscreenButtonMode === 'submenu'">
      <div class="gs-dropdown-item" @click.stop="toggleFullscreen" :title="player.props.i18n.titles.fullscreen">
        <FullscreenSvg style="transform: scale(0.8);"/>
      </div>
      <div v-if="isPipSupported" class="gs-dropdown-item" @click.stop="pip" :title="player.props.i18n.titles.pip">
        <PipSvg style="transform: scale(0.8);"/>
      </div>
    </div>
  </div>
  <!-- 全屏按钮 - 控制面板模式 -->
  <div v-if="player.props.fullscreenButtonMode === 'control' && player.controlsVisibility.fullscreen" class="gs-btn"
       @click.stop="toggleFullscreen" :title="player.props.i18n.titles.fullscreen">
    <FullscreenSvg style="transform: scale(0.8);"/>
  </div>
</template>

<script setup lang="ts">
import {inject, ref, onMounted, computed} from 'vue';
import {FullscreenSvg, WebFullscreenSvg, PipSvg} from '../../svgs';
import {PlayerInjectKey} from '../types/IGsPlayerInject';

import type {IGsPlayerInject} from '../types/IGsPlayerInject';
import {IGsFullscreenControlExpose} from "../types/ControlsExposes";
import {wait} from "gs-base/timer";

const player = inject<IGsPlayerInject>(PlayerInjectKey)!;

const isPipSupported = ref(false);
const isAnyFullscreen = () => player.isWebFullscreen.value || !!document.fullscreenElement;

onMounted(() => {
  isPipSupported.value = document.pictureInPictureEnabled;
});

async function toBestQuality() {
  try {
    await wait(10)
    player.toBestQuality();
  } catch (e) {
    console.log(e)
  }
}

function fullscreen() {
  if (document.fullscreenElement) return;
  player.containerRef.value.requestFullscreen().then(toBestQuality).catch(err => {
    console.error('Error attempting to enable fullscreen:', err);
  });
}

function exitFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(err => {
      console.error('Error attempting to exit fullscreen:', err);
    });
  } else {
    player.isWebFullscreen.value = false
  }
  player.playerRef.value?.autoQualityHls();
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    exitFullscreen()
  } else fullscreen()
}

function webFullscreen() {
  player.isWebFullscreen.value = true;
  toBestQuality()
}

function toggleWebFullscreen() {
  if (isAnyFullscreen()) {
    exitFullscreen()
  } else webFullscreen()
}


async function pip() {
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
}

defineExpose<IGsFullscreenControlExpose>({
  get isAnyFullscreen() {
    return isAnyFullscreen();
  },
  fullscreen,
  webFullscreen,
  toggleWebFullscreen,
  toggleFullscreen,
  exitFullscreen
})

</script>
