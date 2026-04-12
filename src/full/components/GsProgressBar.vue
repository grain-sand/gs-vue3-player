<template>
  <div class="gs-progress-container" @click.stop="handleProgressClick" @mousemove="handleProgressMouseMove"
       @mouseleave="handleProgressMouseLeave">
    <div class="gs-progress-track">
      <div class="gs-progress-fill" :style="{ width: `${player.progress}%` }"></div>
      <div class="gs-progress-handle" :style="{ left: `${player.progress}%` }"></div>
      <!-- 时间提示 -->
      <div v-show="showProgressTooltip" class="gs-progress-tooltip" :style="{ left: `${tooltipPosition}%` }">
        {{ formatTime(tooltipTime) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {inject, ref} from 'vue';
import {PlayerInjectKey} from '../types/PlayerInject';

import type { PlayerInject } from '../types/PlayerInject';

const player = inject<PlayerInject>(PlayerInjectKey)!;

// 状态
const showProgressTooltip = ref(false);
const tooltipPosition = ref(0);
const tooltipTime = ref(0);

// 工具函数：限制范围
const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

// 格式化时间
const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

// 进度条交互
const getProgressRatio = (e: MouseEvent, el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return clamp((e.clientX - rect.left) / rect.width, 0, 1);
};

const handleProgressClick = (e: MouseEvent) => {
  const newTime = getProgressRatio(e, e.currentTarget as HTMLElement) * player.duration;
  if (player.playerRef.value?.el) {
    player.playerRef.value.el.currentTime = newTime;
  }
};

const handleProgressMouseMove = (e: MouseEvent) => {
  const ratio = getProgressRatio(e, e.currentTarget as HTMLElement);
  showProgressTooltip.value = true;
  tooltipPosition.value = clamp(ratio * 100, 5, 95);
  tooltipTime.value = ratio * player.duration;
};

const handleProgressMouseLeave = () => (showProgressTooltip.value = false);
</script>
