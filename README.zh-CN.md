# GsVue3Player

一个可完全自定义的网页播放器！包括样式、插槽、事件、国际化等！基于Vue3和TS！

[English](README.md)

## 安装

```bash
yarn add gs-vue3-player
```

## 使用

### 基本使用

```vue

<template>
  <GsPlayer src="https://example.com/video.m3u8"/>
</template>

<script setup lang="ts">
  import {GsPlayer} from 'gs-vue3-player';
  import 'gs-vue3-player/lib/main.css';
</script>
```

### 列表与导航

```vue

<template>
  <GsPlayer
      :src="videoSrc"
      :list="playlist"
      :mode="playbackMode"
      :rates="[0.5, 1.0, 1.5, 2.0]"
      :visibleItems="['play', 'pre', 'next', 'time', 'speed', 'volume', 'fullscreen', 'progress', 'infoPanel', 'playlist']"
      :keyboardTarget=".gs-player"
      @srcChange="handleSrcChange"
      @volumeChange="handleVolumeChange"
      @modeChange="handleModeChange"
      @rateChange="handleRateChange"
  />
</template>

<script setup lang="ts">
  import {ref} from 'vue';
  import {GsPlayer} from 'gs-vue3-player';
  import 'gs-vue3-player/lib/main.css';

  const videoSrc = 'https://example.com/video.mp4';
  const playlist = [
    {src: 'https://example.com/video1.m3u8', title: 'hls 视频'},
    {src: 'https://example.com/video2.mp4', title: 'mp4 视频'},
    {src: 'https://example.com/video3.webm', title: 'webm 视频'}
  ];
  const playbackMode = ref('sequence');

  const handleSrcChange = (src: any) => {
    console.log('视频源已更改:', src);
  };

  const handleVolumeChange = (volume: number) => {
    console.log('音量已更改:', volume);
  };

  const handleModeChange = (mode: string) => {
    console.log('播放模式已更改:', mode);
  };

  const handleRateChange = (rate: number) => {
    console.log('播放速度已更改:', rate);
  };
</script>
```

### 自定义

#### 样式自定义

```vue

<template>
  <GsPlayer src="https://example.com/video.mp4" class="custom-player"/>
</template>

<script setup lang="ts">
  import {GsPlayer} from 'gs-vue3-player';
</script>

<style lang="scss">
  @use "gs-vue3-player/lib/style.scss";
  @use "gs-vue3-player/lib/variables.scss" as *;
  @include variables('.custom-player');
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
  <GsPlayer src="https://example.com/video.mp4" :i18n="customI18n"/>
</template>

<script setup lang="ts">
  import {GsPlayer, II18n} from 'gs-vue3-player';
  import 'gs-vue3-player/lib/main.css';

  const customI18n: II18n = {
    errorMessage: '请求错误',
    playbackModes: {
      sequence: '顺序播放',
      disabled: '禁用',
      loop: '单个循环',
      loopAll: '全部循环',
      shuffle: '随机播放',
      deleteAfterPlay: '播放后删除'
    },
    titles: {
      play: '播放/暂停',
      pre: '上一个',
      next: '下一个',
      volume: '音量',
      mute: '静音',
      speed: '播放速度',
      fullscreen: '全屏',
      webFullscreen: '网页全屏',
      pip: '弹出窗口'
    }
  };
</script>
```

### 内置语言支持

播放器内置支持多种语言：

- 英语 (`enUS`)
- 简体中文 (`zhCN`)
- 繁体中文 (`zhTW`)
- 日语 (`jaJP`)
- 韩语 (`koKR`)

您可以直接使用它们：

```vue

<template>
  <GsPlayer src="https://example.com/video.mp4" :i18n="jaJP"/>
</template>

<script setup lang="ts">
  import {GsPlayer, jaJP} from 'gs-vue3-player';
  import 'gs-vue3-player/lib/main.css';
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
    <template #buttons="{ isPlaying, togglePlay, volume, setVolume }">
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
  import {GsPlayer} from 'gs-vue3-player';
  import 'gs-vue3-player/lib/main.css';
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

| 属性                   | 类型                   | 默认值                                                                          | 描述        |
|----------------------|----------------------|------------------------------------------------------------------------------|-----------|
| src                  | PlayerSource         | undefined                                                                    | 视频源       |
| playlist             | PlayerSource[]       | []                                                                           | 播放列表      |
| mode                 | PlaybackMode         | 'sequence'                                                                   | 播放模式      |
| rates                | number[]             | [0.8, 1.0, 1.2, 1.5, 2.0, 3.0]                                              | 播放速度      |
| visibleItems         | ControlItemType[]    | ['play', 'pre', 'next', 'time', 'speed', 'volume', 'fullscreen', 'progress', 'playOverlay', 'infoPanel', 'playlist'] | 可见控件      |
| hiddenItems          | ControlItemType[]    | []                                                                           | 隐藏控件      |
| showControls         | boolean              | true                                                                         | 显示控件      |
| showError            | boolean              | true                                                                         | 显示错误信息    |
| handleClick          | boolean              | true                                                                         | 处理播放器点击   |
| handleDblClick       | boolean              | true                                                                         | 处理播放器双击   |
| webFullscreenTarget  | string  HTMLElement  | 'body'                                                                       | 网页全屏目标    |
| fullscreenButtonMode | FullscreenButtonMode | 'submenu'                                                                    | 全屏按钮模式    |
| hlsConfig            | object               | undefined                                                                    | HLS 配置    |
| quality              | object               | undefined                                                                    | 画质配置      |
| useBrowserHls        | boolean              | false                                                                        | 使用浏览器 HLS |
| i18n                 | II18n                | zhCN                                                                         | 国际化配置     |
| keyboardTarget       | string  HTMLElement  false | '.gs-player'                                                           | 键盘事件目标    |
| preSrc               | PlayerSource         | undefined                                                                    | 上一个视频源    |
| nextSrc              | PlayerSource         | undefined                                                                    | 下一个视频源    |

## 事件

| 事件                 | 描述         | 参数                |
|--------------------|------------|-------------------|
| srcChange          | 视频源更改时触发   | src: INavPlayerSource |
| volumeChange       | 音量更改时触发    | volume: number    |
| rateChange         | 播放速度更改时触发  | rate: number      |
| modeChange         | 播放模式更改时触发  | mode: string      |

## 列表与导航

| 插槽       | 描述    | 属性                |
|----------|-------|-------------------|
| footer   | 底部插槽  | slotProps         |
| progress | 进度条插槽 | progressSlotProps |
| controls | 控件插槽  | slotProps         |
| infoPanel | 信息面板插槽 | playlistSlotProps |
| playlist | 播放列表插槽 | playlistSlotProps |

## 暴露的属性和方法

### 属性

> 说明：所有属性均为响应式且实时更新，您可以直接监听这些属性的变化。

| 属性          | 类型                 | 描述                 |
|-------------------|----------------------|-----------------------------|
| player            | HTMLVideoElement     | 视频元素实例              |
| volume            | number               | 当前音量              |
| muted             | boolean              | 静音状态                 |
| time              | number               | 当前播放时间       |
| duration          | number               | 视频时长              |
| rate              | number               | 播放速度               |
| playing           | boolean              | 播放状态              |
| error             | MediaError           | 错误信息           |
| index             | number               | 当前播放列表索引      |

### 方法

| 方法            | 描述                 | 参数                  |
|-------------------|-----------------------------|-----------------------------|
| play              | 播放视频                  | src?: number  PlayerSource |
| playPre           | 播放上一个视频         | -                           |
| playNext          | 播放下一个视频             | -                           |
| setSrc            | 设置视频源            | src: number  PlayerSource |
| setVolume         | 设置音量                  | volume: number              |
| setRate           | 设置播放速度           | rate: number                |
| fullscreen        | 切换全屏           | -                           |
| webFullscreen     | 切换网页全屏       | -                           |
| toBestQuality     | 切换到最佳质量      | reference: { width?: number, height?: number }, now?: boolean |
