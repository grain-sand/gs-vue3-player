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
      :keyboardTarget=".gs-player,.gs-player *"
      @srcChanged="handleSrcChange"
      @volumeChanged="handleVolumeChange"
      @modeChanged="handleModeChange"
      @rateChanged="handleRateChange"
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
      exitFullscreen: '退出全屏',
      webFullscreen: '网页全屏',
      pip: '弹出小窗',
      exitPip: '退出小窗',
      showList: '显示列表',
      hideList: '隐藏列表'
    },
    playlist: '播放列表',
    remove: '移除'
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

## 属性

### IPlayerCoreProps

| 属性           | 类型                   | 默认值              | 描述                 |
|----------------|----------------------|----------------------|-----------------------------|
| src            | PlaySource           | undefined            | 视频源                |
| playlist       | PlaySource[]         | []                   | 播放列表              |
| mode           | PlaybackMode         | 'sequence'           | 播放模式              |
| hlsConfig      | Partial\<HlsConfig\> | undefined            | HLS 配置              |
| quality        | IVideoQuality        | undefined            | 画质配置              |
| useBrowserHls  | boolean              | false                | 使用浏览器 HLS         |
| rate           | number               | 1.0                  | 初始播放速度           |
| autoplay       | boolean              | false                | 自动播放              |
| volume         | number               | 0.8                  | 初始音量 (0-1)         |
| controls       | boolean              | true                 | 显示原生控件           |
| muted          | boolean              | false                | 初始静音状态           |
| preSrc         | PlaySource           | undefined            | 上一个视频源           |
| nextSrc        | PlaySource           | undefined            | 下一个视频源           |

### IGsPlayerProps

| 属性                | 类型                                   | 默认值              | 描述                 |
|---------------------|----------------------------------------|----------------------|-----------------------------|
| i18n                | I18nName \| II18n                      | 'zh-CN'              | 国际化配置              |
| aspectRatio         | AspectRatioMode                        | '16:9'               | 视频宽高比               |
| layout              | LayoutMode                             | 'vertical'           | 布局模式                |
| handleClick         | boolean                                | true                 | 处理播放器点击            |
| handleDblClick      | boolean                                | true                 | 处理播放器双击            |
| rates               | number[]                               | [0.8, 1, 1.2, 1.5, 2.0, 3.0] | 播放速度选项 |
| webFullscreenTarget | string \| HTMLElement                  | 'body'               | 网页全屏目标              |
| keyboardTarget      | HTMLElement \| Document \| null \| string \| false | '.gs-player' | 键盘事件目标 |
| disableWheelNavigation | boolean                          | false                | 禁用鼠标滚轮导航           |
| variableWriteTarget | HTMLElement                            | undefined            | CSS 变量写入目标          |
| controlBar          | null \| IGsWidget \| IControlBarOption | undefined            | 控制面板组件              |
| controlVisibility   | VisibilityMode                         | 'hover'              | 控件可见性模式            |
| infoPanel           | null \| IGsWidget                      | undefined            | 信息面板组件              |
| listContainer       | null \| IGsWidget \| IListContainerOption | undefined        | 列表容器组件              |
| listVisibility      | VisibilityMode                         | 'always'             | 列表可见性模式            |
| playOverlay         | null \| IGsWidget                      | undefined            | 播放覆盖层组件            |
| logics              | IGsLogic[]                             | undefined            | 逻辑组件                  |
| appendLogics        | IGsLogic[]                             | undefined            | 追加逻辑组件              |
| appendInnerWidgets  | IGsWidget \| IGsWidget[] \| null       | undefined            | 追加内部组件              |
| appendOuterWidgets  | IGsWidget \| IGsWidget[] \| null       | undefined            | 追加外部组件              |
| linkHandler         | (url: string) => void                  | window.open          | 链接处理函数              |
| socioWordHandler    | (word: string) => void                 | undefined            | 社交关键词处理函数         |

## 事件

| 事件                 | 描述         | 参数                     |
|--------------------|------------|--------------------------|
| srcChanged          | 视频源更改时触发   | src: ISourceWrapper      |
| srcRemoved          | 视频源移除时触发   | src: ISourceWrapper      |
| volumeChanged       | 音量更改时触发    | volume: number           |
| mutedChanged        | 静音状态更改时触发  | muted: boolean           |
| rateChanged         | 播放速度更改时触发  | rate: number             |
| modeChanged         | 播放模式更改时触发  | mode: PlaybackMode       |

## 键盘快捷键

| 快捷键             | 描述                          |
|-------------------|-------------------------------|
| 空格键            | 播放/暂停                      |
| 左箭头            | 后退 5 秒                     |
| Ctrl + 左箭头     | 后退 15 秒                    |
| 右箭头            | 前进 5 秒                     |
| Ctrl + 右箭头     | 前进 15 秒                    |
| 上箭头            | 播放上一个视频                 |
| 下箭头            | 播放下一个视频                 |
| Enter/Escape      | 切换全屏（与双击功能一致）      |

## 暴露的属性和方法

### 属性

> 说明：所有属性均为响应式且实时更新，您可以直接监听这些属性的变化。

| 属性               | 类型                 | 描述                 |
|-------------------|----------------------|-----------------------------|
| core              | IPlayerCoreExpose    | 核心播放器实例              |
| controlVisibility | VisibilityMode       | 控件可见性模式              |
| listVisibility    | VisibilityMode       | 播放列表可见性模式          |
| layout            | LayoutMode           | 当前布局模式                |
| aspectRatio       | AspectRatioMode      | 视频宽高比                  |
| i18n              | II18n                | 当前国际化配置              |
| isFullscreen      | boolean              | 全屏状态                    |
| container         | HTMLElement          | 容器元素                    |
| containerWidth    | number               | 容器宽度                    |
| containerHeight   | number               | 容器高度                    |

#### 核心属性 (core.*)

| 属性               | 类型                 | 描述                 |
|-------------------|----------------------|-----------------------------|
| core.el           | HTMLVideoElement     | 视频元素实例              |
| core.volume       | number               | 当前音量 (0-1)              |
| core.muted        | boolean              | 静音状态                   |
| core.time         | number               | 当前播放时间               |
| core.duration     | number               | 视频时长                   |
| core.rate         | number               | 播放速度                   |
| core.src          | ISourceWrapper       | 当前视频源                 |
| core.mode         | PlaybackMode         | 播放模式                   |
| core.playing      | boolean              | 播放状态                   |
| core.error        | MediaError           | 错误信息                   |
| core.playlist     | ISourceWrapper[]     | 播放列表项                 |
| core.index        | number               | 当前播放列表索引           |
| core.nextSrc      | PlaySource           | 下一个视频源               |
| core.preSrc       | PlaySource           | 上一个视频源               |
| core.hasPre       | boolean              | 是否有上一个视频           |
| core.hasNext      | boolean              | 是否有下一个视频           |
| core.bestQuality  | IVideoQuality        | 最佳画质信息               |
| core.pipState     | boolean              | 画中画状态                 |
| core.supportsPip  | boolean              | 画中画支持状态             |

### 方法

| 方法               | 描述                 | 参数                  |
|-------------------|-----------------------------|-----------------------------|
| fullscreen        | 切换桌面全屏           | -                           |
| webFullscreen     | 切换网页全屏           | -                           |
| exitFullscreen    | 退出全屏               | -                           |
| setLayout         | 设置布局模式           | layout: LayoutMode          |
| toggleListVisibility | 切换播放列表可见性   | -                           |

#### 核心方法 (core.*)

| 方法               | 描述                 | 参数                  |
|-------------------|-----------------------------|-----------------------------|
| core.play         | 播放视频              | src?: PlaySource            |
| core.pause        | 暂停视频              | -                           |
| core.togglePlay   | 切换播放/暂停         | -                           |
| core.playPre      | 播放上一个视频        | -                           |
| core.playNext     | 播放下一个视频        | -                           |
| core.setSrc       | 设置视频源            | src: PlaySource             |
| core.removeSrc    | 从播放列表移除        | src: PlaySource \| ISourceWrapper |
| core.toBestQuality | 切换到最佳画质      | reference: IVideoQuality, now?: boolean |
| core.autoQualityHls | HLS自动画质切换     | -                           |
| core.enterPip     | 进入画中画模式        | -                           |
| core.exitPip      | 退出画中画模式        | -                           |
| core.togglePip    | 切换画中画模式        | -                           |
