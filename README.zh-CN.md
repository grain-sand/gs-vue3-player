# GsVue3Player

一个基于Vue3和TS的可通过插槽、样式完全自定义的网页播放器！

[English](README.md)

## 安装

```bash
yarn add gs-vue3-player
```

## 使用

### 基本使用

```vue
<template>
  <GsPlayer src="https://example.com/video.m3u8" />
</template>

<script setup lang="ts">
import { GsPlayer } from 'gs-vue3-player';
</script>
```

### 列表与导航

```vue
<template>
  <GsPlayer
    :src="videoSrc"
    :playlist="playlist"
    :playbackMode="playbackMode"
    :playbackRates="[0.5, 1.0, 1.5, 2.0]"
    :visibleControls="['play', 'pre', 'next', 'time', 'speed', 'volume', 'fullscreen', 'progress']"
    @srcChange="handleSrcChange"
    @volumeChange="handleVolumeChange"
    @playbackModeChange="handlePlaybackModeChange"
    @playbackRateChange="handlePlaybackRateChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { GsPlayer } from 'gs-vue3-player';

const videoSrc = 'https://example.com/video.mp4';
const playlist = [
  { src: 'https://example.com/video1.m3u8', title: 'hls 视频' },
  { src: 'https://example.com/video2.mp4', title: 'mp4 视频' },
  { src: 'https://example.com/video3.webm', title: 'webm 视频' }
];
const playbackMode = ref('sequence');

const handleSrcChange = (src: any) => {
  console.log('视频源已更改:', src);
};

const handleVolumeChange = (volume: number) => {
  console.log('音量已更改:', volume);
};

const handlePlaybackModeChange = (mode: string) => {
  console.log('播放模式已更改:', mode);
};

const handlePlaybackRateChange = (rate: number) => {
  console.log('播放速度已更改:', rate);
};
</script>
```

### 自定义

#### 样式自定义

```vue
<template>
  <GsPlayer src="https://example.com/video.mp4" class="custom-player" />
</template>

<script setup lang="ts">
import { GsPlayer } from 'gs-vue3-player';
</script>

<style scoped>
.custom-player {
  --gs-vue3-player-primary-color: #ff6b6b;
  --gs-vue3-player-bg-color: rgba(0, 0, 0, 0.8);
  --gs-vue3-player-text-color: #ffffff;
  --gs-vue3-player-hover-color: #ff8787;
}
</style>
```

#### 国际化自定义

```vue
<template>
  <GsPlayer src="https://example.com/video.mp4" :i18n="customI18n" />
</template>

<script setup lang="ts">
import { GsPlayer } from 'gs-vue3-player';

const customI18n = {
  titles: {
    play: '播放',
    pause: '暂停',
    mute: '静音',
    volume: '音量',
    fullscreen: '全屏',
    webFullscreen: '网页全屏',
    speed: '播放速度',
    quality: '画质',
    error: '播放出错',
  },
  playbackModes: {
    sequence: '顺序播放',
    disabled: '禁用',
    loop: '单个循环',
    loopAll: '全部循环',
    shuffle: '随机播放',
  },
  error: {
    noSource: '请添加播放地址',
    loadingFailed: '加载失败',
    networkError: '网络错误',
  },
  speed: {
    0.5: '0.5x',
    0.8: '0.8x',
    1: '1x',
    1.2: '1.2x',
    1.5: '1.5x',
    2: '2x',
  },
};
</script>
```

#### 插槽自定义

```vue
<template>
  <GsPlayer src="https://example.com/video.mp4">
    <!-- 自定义底部控制区域 -->
    <template #footer="{ isPlaying, togglePlay, currentTime, duration, formatTime }">
      <div class="custom-footer">
        <button @click="togglePlay">
          {{ isPlaying ? '暂停' : '播放' }}
        </button>
        <div class="custom-time">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </div>
      </div>
    </template>
    
    <!-- 自定义进度条 -->
    <template #progress="{ progress, handleProgressClick }">
      <div class="custom-progress" @click="handleProgressClick">
        <div class="custom-progress-track">
          <div class="custom-progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
    </template>
    
    <!-- 自定义控件 -->
    <template #controls="{ isPlaying, togglePlay, volume, setVolume }">
      <div class="custom-controls">
        <button @click="togglePlay">
          {{ isPlaying ? '暂停' : '播放' }}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          :value="volume" 
          @input="setVolume(parseFloat(($event.target as HTMLInputElement).value))"
        />
      </div>
    </template>
  </GsPlayer>
</template>

<script setup lang="ts">
import { GsPlayer } from 'gs-vue3-player';
</script>

<style scoped>
.custom-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
}

.custom-progress {
  width: 100%;
  height: 5px;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
}

.custom-progress-fill {
  height: 100%;
  background: #ff6b6b;
}

.custom-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
```

## 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|-------------|
| src | PlayerSource | undefined | 视频源 |
| playlist | PlayerSource[] | [] | 播放列表 |
| playbackMode | PlaybackMode | 'sequence' | 播放模式 |
| playbackRates | number[] | [0.5, 0.8, 1.0, 1.2, 1.5, 2.0] | 播放速度 |
| visibleControls | ControlType[] | ['play', 'pre', 'next', 'time', 'speed', 'volume', 'fullscreen', 'progress'] | 可见控件 |
| hiddenControls | ControlType[] | [] | 隐藏控件 |
| showControls | boolean | true | 显示控件 |
| showError | boolean | true | 显示错误信息 |
| handleClick | boolean | true | 处理播放器点击 |
| handleDblClick | boolean | true | 处理播放器双击 |
| webFullscreenTarget | string  HTMLElement | 'body' | 网页全屏目标 |
| fullscreenButtonMode | FullscreenButtonMode | 'submenu' | 全屏按钮模式 |
| hlsConfig | object | undefined | HLS 配置 |
| quality | object | undefined | 画质配置 |
| useBrowserHls | boolean | false | 使用浏览器 HLS |
| i18n | II18n | zhCN | 国际化配置 |

## 事件

| 事件 | 描述 | 参数 |
|-------|-------------|------------|
| srcChange | 视频源更改时触发 | src: PlayerSource |
| volumeChange | 音量更改时触发 | volume: number |
| playbackModeChange | 播放模式更改时触发 | mode: string |
| playbackRateChange | 播放速度更改时触发 | rate: number |
| error | 发生错误时触发 | error: Error |
| play | 视频开始播放时触发 | - |
| pause | 视频暂停时触发 | - |
| timeupdate | 时间更新时触发 | event: Event |
| loadedmetadata | 元数据加载完成时触发 | event: Event |
| ended | 视频结束时触发 | - |

## 列表与导航

| 插槽 | 描述 | 属性 |
|------|-------------|-------|
| footer | 底部插槽 | slotProps |
| progress | 进度条插槽 | progressSlotProps |
| controls | 控件插槽 | slotProps |
