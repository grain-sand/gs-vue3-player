import {computed, ref} from 'vue';
import type {ControlType, IGsPlayerProps, PlaybackMode} from '../../types';

interface UsePlayerStateOptions {
  props: IGsPlayerProps;
}

export function usePlayerState({ props }: UsePlayerStateOptions) {
  // State
  const error = ref(false);
  const isPlaying = ref(false);
  const isWebFullscreen = ref(false);
  const currentTime = ref(0);
  const duration = ref(0);
  const playbackRate = ref(1);
  const currentPlaybackMode = ref(props.playbackMode || 'sequence');
  const currentIndex = ref(0);

  // 计算属性：避免模板中频繁调用方法
  const controlsVisibility = computed(() => {
    const isVisible = (name: ControlType) =>
      !props.hiddenControls.includes(name) && props.visibleControls.includes(name);
    return {
      play: isVisible('play'),
      pre: isVisible('pre'),
      next: isVisible('next'),
      time: isVisible('time'),
      speed: isVisible('speed'),
      volume: isVisible('volume'),
      fullscreen: isVisible('fullscreen'),
      progress: isVisible('progress')
    };
  });

  const progress = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0);

  // 可用的播放模式
  const availablePlaybackModes = computed<Array<{
    value: PlaybackMode;
    text: string
  }>>(() => {
    const modes: Array<{ value: PlaybackMode; text: string }> = [
      { value: 'sequence', text: props.i18n.playbackModes.sequence },
      { value: 'disabled', text: props.i18n.playbackModes.disabled },
      { value: 'loop', text: props.i18n.playbackModes.loop }
    ];

    // 如果设置了列表，添加全部循环和随机播放
    if (props.playlist && props.playlist.length > 0) {
      modes.push(
        { value: 'loopAll', text: props.i18n.playbackModes.loopAll },
        { value: 'shuffle', text: props.i18n.playbackModes.shuffle }
      );
    }

    return modes;
  });

  // 插槽属性
  const progressSlotProps = computed(() => ({
    progress: progress.value,
    currentTime: currentTime.value,
    duration: duration.value
  }));

  const slotProps = computed(() => ({
    ...progressSlotProps.value,
    isPlaying: isPlaying.value,
    isWebFullscreen: isWebFullscreen.value,
    playbackRate: playbackRate.value,
    controlsVisibility: controlsVisibility.value
  }));

  return {
    // State
    error,
    isPlaying,
    isWebFullscreen,
    currentTime,
    duration,
    playbackRate,
    currentPlaybackMode,
    currentIndex,
    // Computed
    controlsVisibility,
    progress,
    availablePlaybackModes,
    progressSlotProps,
    slotProps
  };
}
