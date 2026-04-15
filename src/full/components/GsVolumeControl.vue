<template>
  <div v-if="player.controlsVisibility.volume" class="gs-btn gs-dropdown-host" @click.stop="toggleMute"
       @mouseenter="bindWheel" @mouseleave="unbindWheel"
       :title="isMuted || volume === 0 ? player.i18n.titles.mute : player.i18n.titles.volume">
    <component :is="VolumeStateIcons[isMuted.toString()]"
               style="transform: scale(0.95);"/>

    <div class="gs-dropdown gs-volume-panel" @click.stop>
      <div class="gs-volume-val">{{ Math.round(volume * 100) }}%</div>
      <div class="gs-volume-slider" @mousedown="handleVolumeSliderClick">
        <div class="gs-volume-track">
          <div class="gs-volume-fill" :style="{ height: `${volume * 100}%` }"></div>
          <div class="gs-volume-handle" :style="{ bottom: `${volume * 100}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {inject, computed} from 'vue';
import {VolumeStateIcons} from '../svgs';
import {PlayerInjectKey} from '../types/PlayerInject';

import type {PlayerInject} from '../types/PlayerInject';

const player = inject<PlayerInject>(PlayerInjectKey)!;

// 计算属性：从playerRef获取音量和静音状态
const volume = computed(() => player.playerRef.value?.volume || 0);
const isMuted = computed(() => player.playerRef.value?.muted || false);

// 工具函数：限制范围
const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

// 音量控制
const setVolume = (newVol: number) => {
  const clampedVolume = clamp(newVol, 0, 1);
  player.setVolume(clampedVolume);
};

const toggleMute = () => {
  if (player.playerRef.value?.el) {
    player.playerRef.value.el.muted = !player.playerRef.value.el.muted;
  }
};

const handleVolumeSliderClick = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  setVolume((rect.bottom - e.clientY) / rect.height);
};

const handleVolumeWheel = (e: WheelEvent) => {
  e.preventDefault();
  setVolume(volume.value + (e.deltaY > 0 ? -0.1 : 0.1));
};

const bindWheel = () => document.addEventListener('wheel', handleVolumeWheel, {passive: false});
const unbindWheel = () => document.removeEventListener('wheel', handleVolumeWheel);
</script>
