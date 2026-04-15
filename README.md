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

  const handlePlaybackModeChange = (mode: string) => {
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
  import {GsPlayer} from 'gs-vue3-player';
  import 'gs-vue3-player/lib/main.css';

  const customI18n = {
    titles: {
      play: 'Play',
      pause: 'Pause',
      mute: 'Mute',
      volume: 'Volume',
      fullscreen: 'Fullscreen',
      webFullscreen: 'Web Fullscreen',
      speed: 'Playback Speed',
      quality: 'Quality',
      error: 'Error',
    },
    playbackModes: {
      sequence: 'Sequence',
      disabled: 'Disabled',
      loop: 'Loop',
      loopAll: 'Loop All',
      shuffle: 'Shuffle',
    },
    error: {
      noSource: 'Please add a video source',
      loadingFailed: 'Loading failed',
      networkError: 'Network error',
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
    <template #controls="{ isPlaying, togglePlay, volume, setVolume }">
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
| playbackMode         | PlaybackMode         | 'sequence'                                                                   | Playback mode               |
| playbackRates        | number[]             | [0.5, 0.8, 1.0, 1.2, 1.5, 2.0]                                               | Playback rates              |
| visibleControls      | ControlType[]        | ['play', 'pre', 'next', 'time', 'speed', 'volume', 'fullscreen', 'progress'] | Visible controls            |
| hiddenControls       | ControlType[]        | []                                                                           | Hidden controls             |
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

## Events

| Event              | Description                        | Parameters        |
|--------------------|------------------------------------|-------------------|
| srcChange          | Emitted when source changes        | src: PlayerSource |
| volumeChange       | Emitted when volume changes        | volume: number    |
| playbackModeChange | Emitted when playback mode changes | mode: string      |
| playbackRateChange | Emitted when playback rate changes | rate: number      |
| error              | Emitted when error occurs          | error: Error      |
| play               | Emitted when video starts playing  | -                 |
| pause              | Emitted when video pauses          | -                 |
| timeupdate         | Emitted when time updates          | event: Event      |
| loadedmetadata     | Emitted when metadata is loaded    | event: Event      |
| ended              | Emitted when video ends            | -                 |

## List and Navigation

| Slot     | Description       | Props             |
|----------|-------------------|-------------------|
| footer   | Footer slot       | slotProps         |
| progress | Progress bar slot | progressSlotProps |
| controls | Controls slot     | slotProps         |
