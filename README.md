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
      @srcChange="handleSrcChange"
      @volumeChange="handleVolumeChange"
      @modeChange="handleModeChange"
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

  const customI18n : II18n = {
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
      webFullscreen: 'Web Fullscreen',
      pip: 'Picture-in-Picture'
    }
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

#### Slot Customization

```vue

<template>
  <GsPlayer src="https://example.com/video.mp4">
    <!-- Custom footer control area -->
    <template #footer="{ isPlaying, togglePlay, currentTime, duration, formatTime }">
      <div class="custom-footer">
        <button @click="togglePlay">
          {{ isPlaying ? 'Pause' : 'Play' }}
        </button>
        <div class="custom-time">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </div>
      </div>
    </template>

    <!-- Custom progress bar -->
    <template #progress="{ progress, handleProgressClick }">
      <div class="custom-progress" @click="handleProgressClick">
        <div class="custom-progress-track">
          <div class="custom-progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
    </template>

    <!-- Custom controls -->
    <template #buttons="{ isPlaying, togglePlay, volume, setVolume }">
      <div class="custom-controls">
        <button @click="togglePlay">
          {{ isPlaying ? 'Pause' : 'Play' }}
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

## Props

| Prop                 | Type                 | Default                                                                      | Description                 |
|----------------------|----------------------|------------------------------------------------------------------------------|-----------------------------|
| src                  | PlayerSource         | undefined                                                                    | Video source                |
| playlist             | PlayerSource[]       | []                                                                           | Playlist                    |
| mode                 | PlaybackMode         | 'sequence'                                                                   | Playback mode               |
| rates                | number[]             | [0.8, 1.0, 1.2, 1.5, 2.0, 3.0]                                              | Playback rates              |
| visibleItems         | ControlItemType[]    | ['play', 'pre', 'next', 'time', 'speed', 'volume', 'fullscreen', 'progress', 'playOverlay', 'infoPanel', 'playlist'] | Visible controls            |
| hiddenItems          | ControlItemType[]    | []                                                                           | Hidden controls             |
| showControls         | boolean              | true                                                                         | Show controls               |
| showError            | boolean              | true                                                                         | Show error message          |
| handleClick          | boolean              | true                                                                         | Handle player click         |
| handleDblClick       | boolean              | true                                                                         | Handle player double click  |
| webFullscreenTarget  | string  HTMLElement  | 'body'                                                                       | Web fullscreen target       |
| fullscreenButtonMode | FullscreenButtonMode | 'submenu'                                                                    | Fullscreen button mode      |
| hlsConfig            | object               | undefined                                                                    | HLS config                  |
| quality              | object               | undefined                                                                    | Quality config              |
| useBrowserHls        | boolean              | false                                                                        | Use browser HLS             |
| i18n                 | II18n                | zhCN                                                                         | Internationalization config |
| keyboardTarget       | string  HTMLElement  false | '.gs-player'                                                           | Keyboard event target       |
| preSrc               | PlayerSource         | undefined                                                                    | Previous video source       |
| nextSrc              | PlayerSource         | undefined                                                                    | Next video source           |

## Events

| Event              | Description                        | Parameters        |
|--------------------|------------------------------------|-------------------|
| srcChange          | Emitted when source changes        | src: INavPlayerSource |
| volumeChange       | Emitted when volume changes        | volume: number    |
| rateChange         | Emitted when playback rate changes | rate: number      |
| modeChange         | Emitted when playback mode changes | mode: string      |

## List and Navigation

| Slot       | Description         | Props             |
|------------|---------------------|-------------------|
| footer     | Footer slot         | slotProps         |
| progress   | Progress bar slot   | progressSlotProps |
| controls   | Controls slot       | slotProps         |
| infoPanel  | Info panel slot     | playlistSlotProps |
| playlist   | Playlist slot       | playlistSlotProps |

## Expose

### Properties

> Note: All properties are reactive and updated in real-time. You can directly watch them for changes.

| Property          | Type                 | Description                 |
|-------------------|----------------------|-----------------------------|
| player            | HTMLVideoElement     | Video element instance      |
| volume            | number               | Current volume              |
| muted             | boolean              | Mute status                 |
| time              | number               | Current playback time       |
| duration          | number               | Video duration              |
| rate              | number               | Playback rate               |
| playing           | boolean              | Playing status              |
| error             | MediaError           | Error information           |
| index             | number               | Current playlist index      |

### Methods

| Method            | Description                 | Parameters                  |
|-------------------|-----------------------------|-----------------------------|
| play              | Play video                  | src?: number  PlayerSource |
| playPre           | Play previous video         | -                           |
| playNext          | Play next video             | -                           |
| setSrc            | Set video source            | src: number  PlayerSource |
| setVolume         | Set volume                  | volume: number              |
| setRate           | Set playback rate           | rate: number                |
| fullscreen        | Toggle fullscreen           | -                           |
| webFullscreen     | Toggle web fullscreen       | -                           |
| toBestQuality     | Switch to best quality      | reference: { width?: number, height?: number }, now?: boolean |
