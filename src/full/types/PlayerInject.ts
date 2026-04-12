import type {IPlayerExpose, PlayerSource} from '../../types';
import type {ControlType} from '../../types';
import type {FullscreenButtonMode, PlaybackMode} from '../../types';
import type {II18n} from '../../types';

/**
 * 播放器依赖注入接口
 */
export interface PlayerInject {
  // 状态
  error: boolean;
  isPlaying: boolean;
  isWebFullscreen: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  currentPlaybackMode: PlaybackMode;
  currentIndex: number;
  // 计算属性
  controlsVisibility: Record<ControlType, boolean>;
  progress: number;
  availablePlaybackModes: Array<{
    value: PlaybackMode;
    text: string;
  }>;
  // Props
  src?: PlayerSource;
  playlist?: PlayerSource[];
  preSrc?: PlayerSource;
  nextSrc?: PlayerSource;
  i18n: II18n;
  playbackRates: number[];
  fullscreenButtonMode: FullscreenButtonMode;
  webFullscreenTarget: string;
  // 方法
  handleError: (e: Event) => void;
  handleTimeUpdate: (e: Event) => void;
  handleLoadedMetadata: (e: Event) => void;
  handleEnded: () => void;
  togglePlay: () => void;
  play: (src?: any) => void;
  pause: () => void;
  unmute: () => void;
  switchToNextSrc: () => void;
  switchToPreSrc: () => void;
  setPlaybackMode: (mode: string) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  fullscreen: () => void;
  webFullscreen: () => void;
  pip: () => void;
  handlePlayerClick: (e: Event) => void;
  handlePlayerDblClick: (e: Event) => void;
  // Refs
  playerRef: { value: IPlayerExpose | undefined };
}

/**
 * 依赖注入的键
 */
export const PlayerInjectKey = Symbol('PlayerInject');
