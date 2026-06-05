<template>
  <!--suppress HtmlUnknownAttribute -->
  <video
      ref="videoRef"
      :autoplay="props.autoplay"
      :controls="props.controls"
      :muted="props.muted"
      :volume="props.volume"
      @volumechange="volumeChanged"
      @ratechange="rateChanged"
      @error="error = videoRef.error"
      @play="playing = true"
      @pause="playing = false"
      @timeupdate="time = videoRef?.currentTime || 0"
      @loadedmetadata="loadedmetadata"
      @canplaythrough="preLoad"
      @progress="updateBuffer"
      @ended="onEnded"
      @enterpictureinpicture="pipState.value = true"
      @leavepictureinpicture="pipState.value = false"
      @resize="updateSize"
      @mousedown="trigger('mousedown', $event)"
      @mousemove="trigger('mousemove', $event)"
      @mouseup="trigger('mouseup', $event)"
      @mouseleave="trigger('mouseleave', $event)"
      @touchstart="trigger('touchstart', $event)"
      @touchmove="trigger('touchmove', $event)"
      @touchend="trigger('touchend', $event)"
  ></video>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, shallowRef, watch} from 'vue';
import Hls from 'hls.js';
import {
  DefaultHlsConfig,
  DefaultPlaybackMode,
  IPlayerCoreEmits,
  IPlayerCoreExpose,
  IPlayerCoreProps,
  ISourceWrapper,
  IVideoQuality,
  PlaybackMode,
  PlaySource
} from '../type';
import {
  findClosestHlsLevel,
  findClosestQuality,
  getStringSource,
  parseVideoSource,
  selectSmallerQuality,
  switchHlsQuality
} from "../util";
import {SourceWrapper} from './SourceWrapper';

const props = defineProps<IPlayerCoreProps>();

const emit = defineEmits<IPlayerCoreEmits>();

function trigger<T extends keyof IPlayerCoreEmits>(e: T, arg?: Parameters<IPlayerCoreEmits[T]>[0]) {
  // @ts-ignore
  emit(e, arg);
}

const videoRef = ref<HTMLVideoElement>();
const hls = shallowRef<Hls>();
const muted = ref(false);
const volume = ref(0);
const rate = ref(1);
const error = ref<MediaError>()
const playing = ref(false)
const duration = ref(0)
const time = ref(0)
const innerSrc = ref<ISourceWrapper>()
const currentMode = ref<PlaybackMode>(DefaultPlaybackMode)
const bestQuality = ref<Partial<IVideoQuality>>()
const pipState = ref(false)

const buffered = ref<number[][]>([])

const size = ref<[number, number]>([0, 0])

const playlist = ref<ISourceWrapper[]>([]);
const wrapperMap = new Map<PlaySource, ISourceWrapper>();
let idCounter = 0;

defineOptions({inheritAttrs: false});

watch(() => props.mode, mode => currentMode.value = mode || DefaultPlaybackMode, {immediate: true})

function updatePlaylist(list: PlaySource[]) {
  playlist.value = list.map(getWrapper);
  if (list.length) {
    Array.from(wrapperMap.keys()).forEach(s => {
      if (!list.includes(s)) {
        wrapperMap.delete(s);
      }
    });
    if(!innerSrc.value) {
      setSrc(playlist.value[0])
    }
  } else {
    wrapperMap.clear();
  }
}

function getIndex(): number {
  if (!playlist.value.length || !innerSrc.value) {
    return 0;
  }
  return playlist.value.findIndex((item) => item._id === innerSrc.value!._id);
}

function getNextSrc(predefinedNextSrc?: PlaySource): PlaySource | undefined {
  if (predefinedNextSrc) {
    return predefinedNextSrc;
  }
  const i = getIndex();
  return playlist.value[i + 1]
}

function getPreSrc(predefinedPreSrc?: PlaySource): PlaySource | undefined {
  if (predefinedPreSrc) {
    return predefinedPreSrc;
  }
  const i = getIndex();
  return playlist.value[i > 0 ? i - 1 : playlist.value.length - 1];
}

function hasPre(): boolean {
  if (props.preSrc) return true;
  if (!playlist.value.length) return false;
  const mode = currentMode.value;
  if (mode === 'loop' || mode === 'loopAll' || mode === 'shuffle') {
    return playlist.value.length > 1;
  }
  return getIndex() > 0;
}

function hasNext(): boolean {
  if (props.nextSrc) return true;
  if (!playlist.value.length) return false;
  const mode = currentMode.value;
  if (mode === 'loop' || mode === 'loopAll') {
    return true;
  }
  if (mode === 'shuffle') {
    return playlist.value.length > 1;
  }
  return getIndex() < playlist.value.length - 1;
}

function switchToNextInPlaylist(): PlaySource | undefined {
  if (!playlist.value.length) return undefined;

  let nextIndex = getIndex();
  if (currentMode.value === 'shuffle') {
    do {
      nextIndex = Math.floor(Math.random() * playlist.value.length);
    } while (nextIndex === getIndex() && playlist.value.length > 1);
  } else {
    nextIndex = (getIndex() + 1) % playlist.value.length;
  }
  return playlist.value[nextIndex];
}

function changeSource(src: undefined | number | PlaySource, pos: number = 0): PlaySource | undefined {
  let wrapper: ISourceWrapper | undefined;

  if (!(src instanceof SourceWrapper) && (src || src === 0)) {
    if (typeof src === "number") {
      wrapper = playlist.value[src + pos];
    } else if (wrapperMap.has(src)) {
      wrapper = wrapperMap.get(src);
    } else {
      let si = (getIndex() + pos) % playlist.value.length;
      if (si < 0) {
        si = playlist.value.length - 1;
      }
      wrapper = new SourceWrapper(src, idCounter++);
      playlist.value.splice(si, 0, wrapper);
      wrapperMap.set(src, wrapper);
    }
  } else if (src instanceof SourceWrapper) {
    wrapper = src;
  }

  return wrapper;
}

function navTo(dir: -1 | 1, predefinedSrc?: PlaySource): PlaySource | undefined {
  const i = getIndex();
  let source: PlaySource | undefined = predefinedSrc;

  if (!source && playlist.value.length) {
    if (dir === -1) {
      source = playlist.value[i > 0 ? i - 1 : playlist.value.length - 1];
    } else {
      source = playlist.value[(i + 1) % playlist.value.length];
    }
  }

  return changeSource(source, -1);
}

function handleEnded(predefinedNextSrc?: PlaySource): { action: 'play' | 'pause' | 'change', src?: PlaySource } {
  switch (currentMode.value) {
    case 'sequence':
      if (predefinedNextSrc) {
        return {action: 'change', src: predefinedNextSrc};
      } else if (playlist.value.length) {
        if (getIndex() < playlist.value.length - 1) {
          return {action: 'change', src: switchToNextInPlaylist()};
        } else {
          return {action: 'pause'};
        }
      } else {
        return {action: 'pause'};
      }
    case 'disabled':
      return {action: 'pause'};
    case 'loop':
      return {action: 'play'};
    case 'loopAll':
      return {action: 'change', src: switchToNextInPlaylist()};
    case 'shuffle':
      return {action: 'change', src: switchToNextInPlaylist()};
    case 'deleteAfterPlay':
      if (playlist.value.length) {
        const currentIndex = getIndex();
        if (currentIndex >= 0 && currentIndex < playlist.value.length) {
          removePlaylistItem(currentIndex);
          if (playlist.value.length) {
            const nextIndex = currentIndex < playlist.value.length ? currentIndex : 0;
            return {action: 'change', src: playlist.value[nextIndex]};
          } else {
            return {action: 'change', src: undefined};
          }
        }
      }
      return {action: 'change', src: undefined};
    default:
      return {action: 'pause'};
  }
}

function removePlaylistItem(src: number | ISourceWrapper): void {
  const i = typeof src === 'number' ? src : playlist.value.findIndex((item) => item._id === src?._id);
  const delSrc = playlist.value[i];
  if (!delSrc) return;
  playlist.value.splice(i, 1);
  wrapperMap.delete(delSrc._raw);
  trigger('srcRemoved', delSrc);
}

function removeSrc(src: PlaySource | ISourceWrapper): void {
  let wrapper: ISourceWrapper | undefined;
  if (typeof src === 'object' && src !== null && '_id' in src) {
    wrapper = src;
  } else {
    wrapper = wrapperMap.get(src as PlaySource);
  }
  if (wrapper) {
    if (hasNext()) {
      playNext()
    } else if (hasPre()) {
      playPre()
    } else {
      setSrc(undefined)
    }
    removePlaylistItem(wrapper);
  }
}

function insertSrc(src: PlaySource | PlaySource[], index: number = -1): void {
  const sources = Array.isArray(src) ? src : [src];
  const newWrappers: ISourceWrapper[] = [];

  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];
    let wrapper = wrapperMap.get(s);
    if (!wrapper) {
      wrapper = new SourceWrapper(s, idCounter++);
      wrapperMap.set(s, wrapper);
    } else {
      if (playlist.value.find((item) => item._id === wrapper._id)) {
        continue;
      }
    }
    newWrappers.push(wrapper);
  }

  if (!newWrappers.length) {
    return;
  }

  const insertPos = index >= 0 && index <= playlist.value.length ? index : playlist.value.length;
  playlist.value.splice(insertPos, 0, ...newWrappers);
  trigger('srcInserted', newWrappers);
}

function addSrc(src: PlaySource): ISourceWrapper {
  if (src instanceof SourceWrapper) {
    wrapperMap.set(src._raw, src)
    return src;
  }
  let wrapper = wrapperMap.get(src);
  if (!wrapper) {
    wrapper = new SourceWrapper(src, idCounter++);
    wrapperMap.set(src, wrapper);
    playlist.value.push(wrapper);
  }
  return wrapper;
}

function clearPlaylist() {
  wrapperMap.clear();
  playlist.value = [];
  idCounter = 0;
}

let isFirstLoadedmetadata = true;

watch(
    () => [...(props.playlist ?? [])],
    (list) => {
      updatePlaylist(list);
    },
    {immediate: true})

function updateBuffer() {
  const video = videoRef.value;
  if (!video) {
    buffered.value = [];
    return;
  }
  const buf = video.buffered;
  const result: number[][] = [];
  for (let i = 0; i < buf.length; i++) {
    result.push([buf.start(i), buf.end(i)]);
  }
  buffered.value = result;
}

onMounted(() => {
  if (videoRef.value) {
    muted.value = videoRef.value.muted
    volume.value = videoRef.value.volume
  }
  if (props.src) {
    setSrc(props.src);
  } else if (playlist.value.length) {
    setSrc(playlist.value[0]);
  }
})

async function preLoad() {
  const next = getNextSrc(props.nextSrc);
  if (!next) return;
  const wrapper = getWrapper(next);
  if (wrapper._preloaded) return;
  const {type, src} = parseVideoSource(next);
  if (type !== 'hls') return;
  const hls = new Hls({
    ...DefaultHlsConfig,
    autoStartLoad: false,
    startFragPrefetch: true,
  })
  hls.loadSource(src)
  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    adjustHlsQuality(hls, true);
    hls.startLoad(0)
  })
  hls.on(Hls.Events.FRAG_LOADED, () => {
    hls.destroy();
    wrapper._preloaded = true;
  })
}

function updateSize() {
  const video = videoRef.value;
  if (video && video.videoWidth > 0 && video.videoHeight > 0) {
    size.value = [video.videoWidth, video.videoHeight];
  }
  if (innerSrc.value && !innerSrc.value.aspectRatio) {
    innerSrc.value.aspectRatio = size.value;
  }
}

function loadedmetadata() {
  duration.value = videoRef.value.duration
  if (innerSrc.value) {
    innerSrc.value.duration = duration.value
  }
  updateSize();
  if (isFirstLoadedmetadata) {
    isFirstLoadedmetadata = false;
    watch(() => props.rate, (r = 1.0) => {
      videoRef.value.playbackRate = r
    }, {immediate: true})
  }
}

function rateChanged() {
  const old = rate.value;
  rate.value = videoRef.value?.playbackRate || 1
  if (rate.value !== old) {
    trigger('rateChanged', rate.value);
  }
}

function volumeChanged() {
  if (muted.value !== videoRef.value?.muted) {
    muted.value = videoRef.value?.muted || false
    trigger('mutedChanged', muted.value);
  }
  if (volume.value !== videoRef.value?.volume) {
    volume.value = videoRef.value?.volume || 0
    trigger('volumeChanged', volume.value);
  }
}

const destroyHls = () => {
  if (hls.value) {
    hls.value.detachMedia()
    hls.value.destroy();
    hls.value = undefined;
  }
};

function getQuality() {
  if (props.quality?.width) {
    return props.quality.width;
  }
  return videoRef.value?.getBoundingClientRect()?.width || 320;
}

function getWrapper(src: PlaySource | ISourceWrapper | undefined) {
  if (src) {
    if (src instanceof SourceWrapper) {
      return src as ISourceWrapper;
    }
    if (wrapperMap.has(src)) {
      return wrapperMap.get(src as PlaySource);
    }
    return addSrc(src as PlaySource);
  }
}

function setSrc(src: PlaySource | ISourceWrapper | undefined) {
  const wrapper = getWrapper(src);

  if (innerSrc.value === wrapper) {
    return;
  }
  innerSrc.value = wrapper;

  if (wrapper) {
    setTimeout(() => trigger('srcChanged', wrapper), 10);
  }
  destroyHls();
  const video = videoRef.value;
  if (!video) {
    return;
  }
  if (!wrapper) {
    video.removeAttribute('poster')
    video.removeAttribute('src')
    video.load()
    return;
  }

  const autoplay = video.autoplay;
  const {type, src: typedSrc, poster = ''} = parseVideoSource(wrapper._raw);
  const srcStr = getStringSource(typedSrc, getQuality());
  video.poster = poster
  const hlsSupped = Hls.isSupported();
  if (type === 'hls') {
    if (props.useBrowserHls && !hlsSupped && video?.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = srcStr;
    } else if (hlsSupped) {
      const newHls = new Hls({...DefaultHlsConfig, ...props.hlsConfig});
      newHls.loadSource(srcStr);
      newHls.attachMedia(video);
      newHls.on(Hls.Events.MANIFEST_PARSED, () => adjustHlsQuality(newHls, true));
      hls.value = newHls;
    } else {
      throw new Error('Browser not supported hls')
    }
  } else {
    video.src = srcStr;
  }
  video.poster = poster
  video.autoplay = autoplay
  video.playbackRate = rate.value;
}

watch(() => props.src, (newSrc) => {
  if (newSrc) {
    setSrc(newSrc);
  }
});

watch(() => props.mode, (newMode) => {
  if (newMode) {
    currentMode.value = newMode;
    trigger('modeChanged', newMode);
  }
});

onBeforeUnmount(() => {
  destroyHls();
  clearPlaylist();
});

function setVolume(volume: number) {
  const {value: el} = videoRef;
  if (el) {
    el.volume = volume;
    if (volume > 0) try {
      el.muted = false;
    } catch {
    }
  }
}

function catchError(e: Error) {
  if (e.name !== 'AbortError') {
    console.log(e)
  }
}

async function doPlay() {
  const {value: el} = videoRef;
  try {
    el.autoplay = true
    el.playsInline = true
    el.muted = false
    await el?.play()
  } catch (e) {
    if (e.name === 'AbortError') {
      return
    }
    el.muted = true
    await el?.play().catch(catchError)
    el.muted = false
  }
}

function toBestQuality(reference: Partial<IVideoQuality>, now: boolean = false) {
  if (!reference.width && !reference.height) {
    return;
  }

  bestQuality.value = reference;

  const video = videoRef.value;
  if (!video) return;

  const {value: currentSrc} = innerSrc;
  if (!currentSrc) return;

  const {type, src: typedSrc} = parseVideoSource(currentSrc._raw);

  if (type === 'hls' && hls.value) {
    adjustHlsQuality(hls.value, now);
  } else if (Array.isArray(typedSrc)) {
    let bestQualityByWidth = null;
    let bestQualityByHeight = null;

    if (reference.width) {
      bestQualityByWidth = findClosestQuality(typedSrc, reference.width, 'width');
    }

    if (reference.height) {
      bestQualityByHeight = findClosestQuality(typedSrc, reference.height, 'height');
    }

    const selectedQuality = selectSmallerQuality(bestQualityByWidth, bestQualityByHeight);

    if (selectedQuality) {
      const currentTime = video.currentTime;
      const currentUrl = video.currentSrc;
      if (selectedQuality.url !== currentUrl) {
        video.src = selectedQuality.url;
        video.currentTime = currentTime;
        video.play().catch(catchError);
      }
    }
  }
}

function adjustHlsQuality(hls: Hls, now: boolean = false) {
  if (!hls || !bestQuality.value) return;

  const reference = bestQuality.value;
  let bestLevel = -1;

  if (reference.width) {
    const widthLevel = findClosestHlsLevel(hls, reference.width, 'width');
    if (widthLevel !== -1) {
      bestLevel = widthLevel;
    }
  }

  if (reference.height) {
    const heightLevel = findClosestHlsLevel(hls, reference.height, 'height');
    if (heightLevel !== -1) {
      if (bestLevel === -1) {
        bestLevel = heightLevel;
      } else {
        const widthLevelInfo = hls.levels[bestLevel];
        const heightLevelInfo = hls.levels[heightLevel];

        if (widthLevelInfo && heightLevelInfo) {
          const widthArea = widthLevelInfo.width * (widthLevelInfo.height || widthLevelInfo.width);
          const heightArea = heightLevelInfo.width * (heightLevelInfo.height || heightLevelInfo.width);

          if (heightArea < widthArea) {
            bestLevel = heightLevel;
          }
        }
      }
    }
  }

  if (bestLevel !== -1) {
    switchHlsQuality(hls, bestLevel, now);
  }
}

async function changeSourceAndPlay(src: PlaySource | undefined) {
  if (src && videoRef.value) {
    setSrc(src);
    await doPlay();
  } else {
    setSrc(src);
  }
}

const onEnded = () => {
  const el = videoRef.value;
  const wasMuted = el?.muted;

  const result = handleEnded(props.nextSrc);

  switch (result.action) {
    case 'play':
      el?.play().catch(console.log);
      break;
    case 'pause':
      el?.pause();
      break;
    case 'change':
      changeSourceAndPlay(result.src);
      break;
  }

  if (el) {
    el.muted = wasMuted;
  }
};

function supportsPip(): boolean {
  return !!videoRef.value?.requestPictureInPicture;
}

async function enterPip(): Promise<void> {
  if (videoRef.value) {
    await videoRef.value.requestPictureInPicture();
  }
}

async function exitPip(): Promise<void> {
  if (document.exitPictureInPicture) {
    await document.exitPictureInPicture();
  }
}

async function togglePip(): Promise<void> {
  if (pipState.value) {
    await exitPip();
  } else {
    await enterPip();
  }
}

const playPre = async () => {
  const source = navTo(-1, props.preSrc);
  await changeSourceAndPlay(source);
}

const playNext = async () => {
  const source = navTo(1, props.nextSrc);
  await changeSourceAndPlay(source);
}

defineExpose<IPlayerCoreExpose>({
  get el() {
    return videoRef.value
  },
  get volume() {
    return volume.value
  },
  set volume(v) {
    setVolume(v)
  },
  get muted() {
    return muted.value
  },
  set muted(v) {
    videoRef.value.muted = v
  },
  get time() {
    return time.value
  },
  set time(v) {
    videoRef.value.currentTime = v;
  },
  get duration() {
    return duration.value
  },
  set rate(v) {
    videoRef.value.playbackRate = v
  },
  get rate() {
    return rate.value
  },
  get playing() {
    return playing.value
  },
  get error() {
    return error.value;
  },
  get src() {
    return innerSrc.value
  },
  set src(v) {
    setSrc(v)
  },
  get mode() {
    return currentMode.value
  },
  set mode(v) {
    currentMode.value = v;
    trigger('modeChanged', v);
  },
  get playlist() {
    return playlist.value
  },
  get index() {
    return getIndex()
  },
  get nextSrc() {
    return getNextSrc(props.nextSrc)
  },
  get preSrc() {
    return getPreSrc(props.preSrc)
  },
  get hasPre() {
    return hasPre()
  },
  get hasNext() {
    return hasNext()
  },
  async togglePlay() {
    const {value: el} = videoRef;
    if (el.paused) {
      await doPlay()
    } else {
      await el.pause()
    }
  },
  async play(src?: PlaySource) {
    if (!src) {
      await doPlay()
      return;
    }
    setSrc(src);
    await doPlay()
  },
  setSrc,
  async pause() {
    await videoRef.value?.pause()
  },
  async unmute() {
    videoRef.value.muted = false
  },
  toBestQuality,
  autoQualityHls() {
    bestQuality.value = undefined;
    if (hls.value) {
      hls.value.nextLevel = -1;
    }
  },
  get bestQuality() {
    return bestQuality.value;
  },
  removeSrc,
  insertSrc,
  playPre,
  playNext,
  get pipState() {
    return pipState.value;
  },
  get supportsPip() {
    return supportsPip();
  },
  enterPip,
  exitPip,
  togglePip,
  get buffered() {
    return buffered.value
  },
  get size() {
    return size.value
  },
  get style() {
    return videoRef.value?.style || {} as CSSStyleDeclaration;
  },
  clearPlaylist() {
    playlist.value = [];
    wrapperMap.clear()
    trigger('clearPlaylist');
    setSrc(undefined);
    doPlay()
    setTimeout(() => videoRef.value?.pause(), 100)
  }
})
</script>
