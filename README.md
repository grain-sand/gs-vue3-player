# GsVue3Player

A fully customizable web player with styles, slots, events, internationalization, and more! Built with Vue3 and TS!

[中文](README.zh-CN.md)

## Installation

```bash
yarn add gs-vue3-player
```

## Usage

### Basic Usage

```vue

<template>
  <GsPlayer src="https://example.com/video.m3u8"/>
</template>

<script setup lang="ts">
  import {GsPlayer} from 'gs-vue3-player';
  import 'gs-vue3-player/lib/main.css';
</script>
```

### List and Navigation

```vue

<template>
  <GsPlayer
      :src="videoSrc"
      :list="playlist"
      :mode="playbackMode"
      :rates="[0.5, 1.0, 1.5, 2.0]"
      :visibleItems="['play', 'pre', 'next', 'time', 'speed', 'volume', 'fullscreen', 'progress', 'infoPanel', 'playlist']"
      :keyboardTarget=".gs-player"
      @srcChanged="handleSrcChange"
      @volumeChanged="handleVolumeChange"
      @modeChanged="handleModeChange"
      @playbackRateChange="handlePlaybackRateChange"
  />
</template>

<script setup lang="ts">
  import {ref} from 'vue';
  import {GsPlayer} from 'gs-vue3-player';
  import 'gs-vue3-player/lib/main.css';

  const videoSrc = 'https://example.com/video.mp4';
  const playlist = [
    {src: 'https://example.com/video1.m3u8', title: 'hls video'},
    {src: 'https://example.com/video2.mp4', title: 'mp4 video'},
    {src: 'https://example.com/video3.webm', title: 'webm video'}
  ];
  const playbackMode = ref('sequence');

  const handleSrcChange = (src: any) => {
    console.log('Source changed:', src);
  };

  const handleVolumeChange = (volume: number) => {
    console.log('Volume changed:', volume);
  };

  const handleModeChange = (mode: string) => {
    console.log('Playback mode changed:', mode);
  };

  const handlePlaybackRateChange = (rate: number) => {
    console.log('Playback rate changed:', rate);
  };
</script>
```

### Customization

#### Style Customization

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

#### Internationalization Customization

```vue

<template>
  <GsPlayer src="https://example.com/video.mp4" :i18n="customI18n"/>
</template>

<script setup lang="ts">
  import {GsPlayer, II18n} from 'gs-vue3-player';
  import 'gs-vue3-player/lib/main.css';

  const customI18n: II18n = {
    errorMessage: 'Request Error',
    playbackModes: {
      sequence: 'Play Sequence',
      disabled: 'Disabled',
      loop: 'Loop Current',
      loopAll: 'Loop All',
      shuffle: 'Shuffle',
      deleteAfterPlay: 'Delete After Play'
    },
    titles: {
      play: 'Play/Pause',
      pre: 'Previous',
      next: 'Next',
      volume: 'Volume',
      mute: 'Mute',
      speed: 'Playback Speed',
      fullscreen: 'Fullscreen',
      exitFullscreen: 'Exit Fullscreen',
      webFullscreen: 'Web Fullscreen',
      pip: 'Picture-in-Picture',
      exitPip: 'Exit Picture-in-Picture',
      showList: 'Show List',
      hideList: 'Hide List'
    },
    playlist: 'Playlist',
    remove: 'Remove'
  };
</script>
```

### Built-in Languages

The player comes with built-in support for multiple languages:

- English (`enUS`)
- Simplified Chinese (`zhCN`)
- Traditional Chinese (`zhTW`)
- Japanese (`jaJP`)
- Korean (`koKR`)

You can use them directly:

```vue

<template>
  <GsPlayer src="https://example.com/video.mp4" :i18n="jaJP"/>
</template>

<script setup lang="ts">
  import {GsPlayer, jaJP} from 'gs-vue3-player';
  import 'gs-vue3-player/lib/main.css';
</script>
```

## Props

### IPlayerCoreProps

| Prop           | Type                 | Default              | Description                 |
|----------------|----------------------|----------------------|-----------------------------|
| src            | PlaySource           | undefined            | Video source                |
| playlist       | PlaySource[]         | []                   | Playlist                    |
| mode           | PlaybackMode         | 'sequence'           | Playback mode               |
| hlsConfig      | Partial\<HlsConfig\> | undefined            | HLS config                  |
| quality        | IVideoQuality        | undefined            | Quality config              |
| useBrowserHls  | boolean              | false                | Use browser HLS             |
| rate           | number               | 1.0                  | Initial playback rate       |
| autoplay       | boolean              | false                | Auto play                   |
| volume         | number               | 0.8                  | Initial volume (0-1)        |
| controls       | boolean              | true                 | Show native controls        |
| muted          | boolean              | false                | Initial muted state         |
| preSrc         | PlaySource           | undefined            | Previous video source       |
| nextSrc        | PlaySource           | undefined            | Next video source           |

### IGsPlayerProps

| Prop                | Type                                   | Default              | Description                 |
|---------------------|----------------------------------------|----------------------|-----------------------------|
| i18n                | I18nName \| II18n                      | 'zh-CN'              | Internationalization config |
| aspectRatio         | AspectRatioMode                        | '16:9'               | Video aspect ratio          |
| layout              | LayoutMode                             | 'vertical'           | Layout mode                 |
| handleClick         | boolean                                | true                 | Handle player click         |
| handleDblClick      | boolean                                | true                 | Handle player double click  |
| rates               | number[]                               | [0.8, 1, 1.2, 1.5, 2.0, 3.0] | Playback rates |
| webFullscreenTarget | string \| HTMLElement                  | 'body'               | Web fullscreen target       |
| keyboardTarget      | HTMLElement \| Document \| null \| string \| false | '.gs-player' | Keyboard event target |
| disableWheelNavigation | boolean                          | false                | Disable wheel navigation    |
| variableWriteTarget | HTMLElement                            | undefined            | CSS variable write target   |
| controlBar          | null \| IGsWidget \| IControlBarOption | undefined            | Control bar component       |
| controlVisibility   | VisibilityMode                         | 'hover'              | Control visibility mode     |
| infoPanel           | null \| IGsWidget                      | undefined            | Info panel component        |
| listContainer       | null \| IGsWidget \| IListContainerOption | undefined        | List container component    |
| listVisibility      | VisibilityMode                         | 'always'             | List visibility mode        |
| playOverlay         | null \| IGsWidget                      | undefined            | Play overlay component      |
| logics              | IGsLogic[]                             | undefined            | Logic components            |
| appendLogics        | IGsLogic[]                             | undefined            | Append logic components     |
| appendInnerWidgets  | IGsWidget \| IGsWidget[] \| null       | undefined            | Append inner widgets        |
| appendOuterWidgets  | IGsWidget \| IGsWidget[] \| null       | undefined            | Append outer widgets        |
| linkHandler         | (url: string) => void                  | window.open          | Link handler                |
| socioWordHandler    | (word: string) => void                 | undefined            | Social word handler         |

## Events

| Event              | Description                        | Parameters                     |
|--------------------|------------------------------------|--------------------------------|
| srcChanged          | Emitted when source changes        | src: ISourceWrapper            |
| srcRemoved          | Emitted when source is removed     | src: ISourceWrapper            |
| volumeChanged       | Emitted when volume changes        | volume: number                 |
| mutedChanged        | Emitted when muted state changes   | muted: boolean                 |
| rateChanged         | Emitted when playback rate changes | rate: number                   |
| modeChanged         | Emitted when playback mode changes | mode: PlaybackMode             |

## Keyboard Shortcuts

| Shortcut          | Description                          |
|-------------------|--------------------------------------|
| Space             | Play/Pause                           |
| Arrow Left        | Rewind 5 seconds                     |
| Ctrl + Arrow Left | Rewind 15 seconds                    |
| Arrow Right       | Fast forward 5 seconds               |
| Ctrl + Arrow Right| Fast forward 15 seconds              |
| Arrow Up          | Play previous video                  |
| Arrow Down        | Play next video                      |
| Enter/Escape      | Toggle fullscreen (same as double click) |

## Expose

### Properties

> Note: All properties are reactive and updated in real-time. You can directly watch them for changes.

| Property          | Type                 | Description                 |
|-------------------|----------------------|-----------------------------|
| core              | IPlayerCoreExpose    | Core player instance        |
| controlVisibility | VisibilityMode       | Control visibility mode     |
| listVisibility    | VisibilityMode       | Playlist visibility mode    |
| layout            | LayoutMode           | Current layout mode         |
| aspectRatio       | AspectRatioMode      | Video aspect ratio          |
| i18n              | II18n                | Current i18n config         |
| isFullscreen      | boolean              | Fullscreen status           |
| container         | HTMLElement          | Container element           |
| containerWidth    | number               | Container width             |
| containerHeight   | number               | Container height            |

#### Core Properties (core.*)

| Property          | Type                 | Description                 |
|-------------------|----------------------|-----------------------------|
| core.el           | HTMLVideoElement     | Video element instance      |
| core.volume       | number               | Current volume (0-1)        |
| core.muted        | boolean              | Mute status                 |
| core.time         | number               | Current playback time       |
| core.duration     | number               | Video duration              |
| core.rate         | number               | Playback rate               |
| core.src          | ISourceWrapper       | Current source              |
| core.mode         | PlaybackMode         | Playback mode               |
| core.playing      | boolean              | Playing status              |
| core.error        | MediaError           | Error information           |
| core.playlist     | ISourceWrapper[]     | Playlist items              |
| core.index        | number               | Current playlist index      |
| core.nextSrc      | PlaySource           | Next source                 |
| core.preSrc       | PlaySource           | Previous source             |
| core.hasPre       | boolean              | Has previous video          |
| core.hasNext      | boolean              | Has next video              |
| core.bestQuality  | IVideoQuality        | Best quality info           |
| core.pipState     | boolean              | Picture-in-Picture state    |
| core.supportsPip  | boolean              | PiP support status          |

### Methods

| Method            | Description                 | Parameters                  |
|-------------------|-----------------------------|-----------------------------|
| fullscreen        | Toggle desktop fullscreen   | -                           |
| webFullscreen     | Toggle web fullscreen       | -                           |
| exitFullscreen    | Exit fullscreen             | -                           |
| setLayout         | Set layout mode             | layout: LayoutMode          |
| toggleListVisibility | Toggle playlist visibility | -                        |

#### Core Methods (core.*)

| Method            | Description                 | Parameters                  |
|-------------------|-----------------------------|-----------------------------|
| core.play         | Play video                  | src?: PlaySource            |
| core.pause        | Pause video                 | -                           |
| core.togglePlay   | Toggle play/pause           | -                           |
| core.playPre      | Play previous video         | -                           |
| core.playNext     | Play next video             | -                           |
| core.setSrc       | Set video source            | src: PlaySource             |
| core.removeSrc    | Remove from playlist        | src: PlaySource \| ISourceWrapper |
| core.toBestQuality | Switch to best quality    | reference: IVideoQuality, now?: boolean |
| core.autoQualityHls | Auto quality for HLS      | -                           |
| core.enterPip     | Enter Picture-in-Picture    | -                           |
| core.exitPip      | Exit Picture-in-Picture     | -                           |
| core.togglePip    | Toggle Picture-in-Picture   | -                           |
