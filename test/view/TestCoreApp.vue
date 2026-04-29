<template>
  <div class="TestApp">
    <!--suppress TypeScriptValidateTypes -->
    <PlayerCore
        ref="playerCoreRef"
        :playlist="videos"
        :mode="currentMode"
        :controls="false"
        :autoplay="false"
        :volume="0.5"
        @src-change="handleSrcChange"
        @volume-change="handleVolumeChange"
        @mode-change="handleModeChange"
    />

    <div class="controls-panel">

      <div class="info-panel">
        <p>当前状态: {{ playerCoreRef?.playing ? '播放中' : '已暂停' }}</p>
        <p>当前时间: {{ formatTime(playerCoreRef?.time || 0) }}</p>
        <p>总时长: {{ formatTime(playerCoreRef?.duration || 0) }}</p>
        <p>音量: {{ Math.round((playerCoreRef?.volume || 0) * 100) }}%</p>
        <p>播放速度: {{ playerCoreRef?.rate }}x</p>
        <p>当前索引: {{ playerCoreRef?.index + 1 }} / {{ playerCoreRef?.playlist.length }}</p>
        <p>播放模式: {{ currentMode }}</p>
      </div>
      <h3>播放控制</h3>
      <div class="button-group">
        <button @click="handlePlay">播放</button>
        <button @click="handlePause">暂停</button>
        <button @click="handleTogglePlay">切换播放</button>
        <button @click="handleUnmute">取消静音</button>
      </div>

      <h3>播放列表导航</h3>
      <div class="button-group">
        <button @click="handlePlayPre">上一个</button>
        <button @click="handlePlayNext">下一个</button>
      </div>

      <h3>音量控制</h3>
      <div class="button-group">
        <button @click="playerCoreRef.muted = true">静音</button>
        <button @click="setVolume(0.25)">25%</button>
        <button @click="setVolume(0.5)">50%</button>
        <button @click="setVolume(0.75)">75%</button>
        <button @click="setVolume(1)">100%</button>
      </div>

      <h3>播放速度</h3>
      <div class="button-group">
        <button @click="setRate(0.5)">0.5x</button>
        <button @click="setRate(1)">1x</button>
        <button @click="setRate(1.5)">1.5x</button>
        <button @click="setRate(2)">2x</button>
      </div>

      <h3>播放模式</h3>
      <div class="button-group">
        <button :class="{active: currentMode === 'sequence'}" @click="setMode('sequence')">顺序</button>
        <button :class="{active: currentMode === 'loop'}" @click="setMode('loop')">循环</button>
        <button :class="{active: currentMode === 'loopAll'}" @click="setMode('loopAll')">列表循环</button>
        <button :class="{active: currentMode === 'shuffle'}" @click="setMode('shuffle')">随机</button>
        <button :class="{active: currentMode === 'disabled'}" @click="setMode('disabled')">禁用</button>
        <button :class="{active: currentMode === 'deleteAfterPlay'}" @click="setMode('deleteAfterPlay')">播放后删除
        </button>
      </div>

      <h3>质量控制</h3>
      <div class="button-group">
        <button @click="handleAutoQuality">自动质量</button>
        <button @click="handleBestQuality(640)">最佳质量(640px)</button>
        <button @click="handleBestQuality(1280)">最佳质量(1280px)</button>
      </div>

      <h3>时间控制</h3>
      <div class="button-group">
        <button @click="seek(-10)">-10秒</button>
        <button @click="seek(10)">+10秒</button>
        <button @click="seekTo(0)">回到开头</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {videos} from "./videos.local";
import {PlayerCore} from "../../src/core";
import type {IPlayerCoreExpose, PlaybackMode} from "../../src";

const playerCoreRef = ref<IPlayerCoreExpose>();
const currentMode = ref<PlaybackMode>('sequence');

const handleSrcChange = (src: any) => {
  console.log('Source changed:', src);
};

const handleVolumeChange = (volume: number) => {
  console.log('Volume changed:', volume);
};

const handleModeChange = (mode: string) => {
  console.log('Mode changed:', mode);
};

const handlePlay = () => {
  playerCoreRef.value?.play();
};

const handlePause = () => {
  playerCoreRef.value?.pause();
};

const handleTogglePlay = () => {
  playerCoreRef.value?.togglePlay();
};

const handleUnmute = () => {
  playerCoreRef.value?.unmute();
};

const handlePlayPre = () => {
  playerCoreRef.value?.playPre();
};

const handlePlayNext = () => {
  playerCoreRef.value?.playNext();
};

const setVolume = (volume: number) => {
  playerCoreRef.value.volume = volume;
};

const setRate = (rate: number) => {
  if (playerCoreRef.value) {
    playerCoreRef.value.rate = rate;
  }
};

const setMode = (mode: PlaybackMode) => {
  currentMode.value = mode;
};

const handleAutoQuality = () => {
  playerCoreRef.value?.autoQualityHls();
};

const handleBestQuality = (width: number) => {
  playerCoreRef.value?.toBestQuality({width}, true);
};

const seek = (seconds: number) => {
  if (playerCoreRef.value) {
    playerCoreRef.value.time = Math.max(0, Math.min(playerCoreRef.value.time + seconds, playerCoreRef.value.duration));
  }
};

const seekTo = (time: number) => {
  if (playerCoreRef.value) {
    playerCoreRef.value.time = time;
  }
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
</script>

<style scoped>
.TestApp {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-flow: nowrap column;
}

.controls-panel {
  margin-top: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

h3 {
  margin: 16px 0 8px;
  color: #333;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #42b983;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

button:hover {
  background: #379a6b;
}

button.active {
  background: #2c7a5b;
}

.info-panel {
  background: #fff;
  padding: 12px;
  border-radius: 4px;
}

.info-panel p {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
}
</style>
