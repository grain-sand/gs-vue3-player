import type {IPlayerExpose, IPlayerProps} from './IPlayerProps';
import type {PlayerSource} from './IPlayerSource';

/** 按钮类型 */
export const ControlTypes = ['play', 'pre', 'next', 'time', 'speed', 'volume', 'fullscreen'] as const;
/** 按钮类型联合类型 */
export type ControlType = (typeof ControlTypes)[number];

export interface IGsPlayerProps extends IPlayerProps {
  /** 是否显示控制面板 */
  showControls?: boolean;
  /** 是否显示错误信息 */
  showError?: boolean;
  /** 自定义错误信息 */
  errorMessage?: string;
  /** 下一个输入源 */
  nextSrc?: PlayerSource;
  /** 上一个输入源 */
  preSrc?: PlayerSource;
  /** 是否处理播放器单击，默认为true，为静音时，为取消静音，否则为切换播放 */
  handleClick?: boolean;
  /** 是否处理播放器双击，默认为true，用于 在常规状态切换到网页全屏，在任意全屏状态都是退出全屏 */
  handleDblClick?: boolean;
  /** 可改变速度的数字数组，默认为 [0.5, 0.8, 1, 1.2, 1.5, 2] */
  playbackRates?: number[];
  /** 需要显示的按钮，默认为全部显示 */
  visibleControls?: ControlType[];
  /** 排除显示的按钮，默认为空，冲突时排除优先级更高 */
  hiddenControls?: ControlType[];
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
