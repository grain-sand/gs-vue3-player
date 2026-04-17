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
import {inject, ref, onMounted} from 'vue';
import {FullscreenSvg, WebFullscreenSvg, PipSvg} from '../../svgs';
import {PlayerInjectKey} from '../types/IGsPlayerInject';

import type {IGsPlayerInject} from '../types/IGsPlayerInject';
import {IGsFullscreenControlExpose} from "../types/ControlsExposes";
import {wait} from "gs-base/timer";

const player = inject<IGsPlayerInject>(PlayerInjectKey)!;

const isPipSupported = ref(false);

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
  const el = player.playerRef.value?.el;
  if (!el || document.fullscreenElement) return;
  el.requestFullscreen().then(toBestQuality).catch(err => {
    console.error('Error attempting to enable fullscreen:', err);
  });
}

function exitFullscreen() {
  player.isWebFullscreen.value = false
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(err => {
      console.error('Error attempting to exit fullscreen:', err);
    });
  }
}

function toggleFullscreen() {
  const el = player.playerRef.value?.el;
  if (!el) return;
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(err => {
      console.error('Error attempting to exit fullscreen:', err);
    });
  } else fullscreen()
}

function webFullscreen() {
  player.isWebFullscreen.value = true;
  toBestQuality()
}

function toggleWebFullscreen() {
  const {isWebFullscreen: wf} = player;
  if (wf.value) {
    wf.value = false;
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
    return player.isWebFullscreen.value || !!document.fullscreenElement;
  },
  fullscreen,
  webFullscreen,
  toggleWebFullscreen,
  toggleFullscreen,
  exitFullscreen
})

</script>
