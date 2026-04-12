import {watch} from 'vue';
import type {IGsPlayerProps, IPlayerExpose, PlaybackMode} from '../../types';

interface UsePlayerControlsOptions {
  playerRef: { value: IPlayerExpose };
  playerContainerRef?: { value: HTMLElement | undefined };
  props: IGsPlayerProps;
  currentPlaybackMode: { value: PlaybackMode };
  currentIndex: { value: number };
  isPlaying: { value: boolean };
  playbackRate: { value: number };
  isWebFullscreen: { value: boolean };
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setError: (error: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
}

export function usePlayerControls({
  playerRef,
  playerContainerRef,
  props,
  currentPlaybackMode,
  currentIndex,
  isPlaying,
  playbackRate,
  isWebFullscreen,
  setCurrentTime,
  setDuration,
  setError,
  setIsPlaying
}: UsePlayerControlsOptions) {
  // 播放控制
  const togglePlay = async () => {
    await playerRef.value?.togglePlay();
    setIsPlaying(!isPlaying.value);
  };
  const play = async (src?: any) => {
    await playerRef.value?.play(src);
    setIsPlaying(true);
  };
  const pause = async () => {
    await playerRef.value?.pause();
    setIsPlaying(false);
  };
  const unmute = async () => await playerRef.value?.unmute();
  const switchToNextSrc = () => {
    if (props.nextSrc) {
      playerRef.value?.play(props.nextSrc);
    } else if (props.playlist && props.playlist.length > 0) {
      switchToNextInPlaylist();
    }
  };
  const switchToPreSrc = () => {
    if (props.preSrc) {
      playerRef.value?.play(props.preSrc);
    } else if (props.playlist && props.playlist.length > 0) {
      switchToPreInPlaylist();
    }
  };

  // 播放模式控制
  const setPlaybackMode = (mode: PlaybackMode) => {
    currentPlaybackMode.value = mode;
  };

  // 播放列表管理
  const switchToNextInPlaylist = () => {
    if (!props.playlist || props.playlist.length === 0) return;

    let nextIndex = currentIndex.value;
    if (currentPlaybackMode.value === 'shuffle') {
      // 随机播放，确保不重复当前索引
      do {
        nextIndex = Math.floor(Math.random() * props.playlist.length);
      } while (nextIndex === currentIndex.value && props.playlist.length > 1);
    } else {
      nextIndex = (currentIndex.value + 1) % props.playlist.length;
    }

    currentIndex.value = nextIndex;
    playerRef.value?.play(props.playlist[nextIndex]);
  };

  const switchToPreInPlaylist = () => {
    if (!props.playlist || props.playlist.length === 0) return;

    let preIndex = currentIndex.value;
    if (currentPlaybackMode.value === 'shuffle') {
      // 随机播放，确保不重复当前索引
      do {
        preIndex = Math.floor(Math.random() * props.playlist.length);
      } while (preIndex === currentIndex.value && props.playlist.length > 1);
    } else {
      preIndex = (currentIndex.value - 1 + props.playlist.length) % props.playlist.length;
    }

    currentIndex.value = preIndex;
    playerRef.value?.play(props.playlist[preIndex]);
  };

  // 处理播放结束
  const handleEnded = () => {
    switch (currentPlaybackMode.value) {
      case 'sequence':
        // 检查是否有下一个视频
        if (props.nextSrc) {
          switchToNextSrc();
        } else if (props.playlist && props.playlist.length > 0) {
          // 如果是播放列表的最后一个视频，则停止播放
          if (currentIndex.value < props.playlist.length - 1) {
            switchToNextInPlaylist();
          } else {
            pause();
          }
        } else {
          // 没有下一个视频，停止播放
          pause();
        }
        break;
      case 'disabled':
        // 停止播放
        pause();
        break;
      case 'loop':
        // 重新播放当前视频
        playerRef.value?.el?.play();
        break;
      case 'loopAll':
        switchToNextInPlaylist();
        break;
      case 'shuffle':
        switchToNextInPlaylist();
        break;
    }
  };

  // 其他设置
  const setPlaybackRate = (rate: number) => {
    playbackRate.value = rate;
    if (playerRef.value?.el) playerRef.value.el.playbackRate = rate;
  };

  const setVolume = (volume: number) => {
    if (playerRef.value?.el) {
      playerRef.value.el.volume = volume;
      playerRef.value.el.muted = volume === 0;
    }
  };

  const fullscreen = () => {
    const el = playerContainerRef?.value || document.querySelector('.gs-player');
    if (!document.fullscreenElement && el) el.requestFullscreen().catch(console.error);
    else if (document.exitFullscreen) document.exitFullscreen();
  };

  const webFullscreen = () => (isWebFullscreen.value = !isWebFullscreen.value);

  const handlePlayerClick = () => props.handleClick && togglePlay();
  const handlePlayerDblClick = () => {
    if (!props.handleDblClick) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (isWebFullscreen.value) isWebFullscreen.value = false;
    else webFullscreen();
  };

  // 监听 playlist 变化
  watch(
    () => props.playlist,
    (newPlaylist) => {
      if (newPlaylist && newPlaylist.length > 0) {
        // 如果没有设置 src，则使用 playlist 中的第一个视频
        if (!props.src) {
          playerRef.value?.play(newPlaylist[0]);
        }
      }
    },
    { deep: true }
  );

  // 事件处理
  const handleError = () => setError(true);
  const handleTimeUpdate = (e: Event) => setCurrentTime((e.target as HTMLVideoElement).currentTime);
  const handleLoadedMetadata = (e: Event) => setDuration((e.target as HTMLVideoElement).duration);

  return {
    // Methods
    handleError,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    togglePlay,
    play,
    pause,
    unmute,
    switchToNextSrc,
    switchToPreSrc,
    setPlaybackMode,
    setPlaybackRate,
    setVolume,
    fullscreen,
    webFullscreen,
    handlePlayerClick,
    handlePlayerDblClick
  };
}
