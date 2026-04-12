import type {IGsPlayerProps, IPlayerExpose} from '../../types';
import {usePlayerState} from './usePlayerState';
import {usePlayerControls} from './usePlayerControls';

interface UsePlayerOptions {
  playerRef: { value: IPlayerExpose };
  playerContainerRef?: { value: HTMLElement | undefined };
  props: IGsPlayerProps;
}

export function usePlayer({ playerRef, playerContainerRef, props }: UsePlayerOptions) {
  // 使用状态管理
  const state = usePlayerState({ props });

  // 状态设置函数
  const setCurrentTime = (time: number) => state.currentTime.value = time;
  const setDuration = (duration: number) => state.duration.value = duration;
  const setError = (error: boolean) => state.error.value = error;
  const setIsPlaying = (playing: boolean) => state.isPlaying.value = playing;

  // 使用控制逻辑
  const controls = usePlayerControls({
    playerRef,
    playerContainerRef,
    props,
    currentPlaybackMode: state.currentPlaybackMode,
    currentIndex: state.currentIndex,
    isPlaying: state.isPlaying,
    playbackRate: state.playbackRate,
    isWebFullscreen: state.isWebFullscreen,
    setCurrentTime,
    setDuration,
    setError,
    setIsPlaying
  });

  return {
    ...state,
    ...controls
  };
}
