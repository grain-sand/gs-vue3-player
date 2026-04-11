import type {IPlayerExpose, IPlayerProps} from './IPlayerProps';
import type {PlayerSource} from './IPlayerSource';

export interface IGsPlayerProps extends IPlayerProps {
  /** 是否显示控制面板 */
  showControls?: boolean;
  /** 是否显示错误信息 */
  showError?: boolean;
  /** 自定义错误信息 */
  errorMessage?: string;
  /** 下一个输入源 */
  nextSrc?: PlayerSource;
}

export interface IGsPlayerExpose extends IPlayerExpose {
  /** 播放器实例 */
  player: HTMLVideoElement;
  /** 设置音量 */
  setVolume(volume: number): void;
  /** 设置播放速度 */
  setPlaybackRate(rate: number): void;
  /** 全屏 */
  fullscreen(): void;
  /** 网页全屏 */
  webFullscreen(): void;
}

export type PlaybackRate = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

export type PlayerStatus = 'loading' | 'playing' | 'paused' | 'error';
