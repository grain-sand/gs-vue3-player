import type {IPlayerEmits, IPlayerExpose, IPlayerProps} from './IPlayerProps';
import type {INavPlayerSource, PlayerSource} from './IPlayerSource';
import type {ControlItemType} from './ISlotProps';
import {II18n} from "./II18n";

/** 全屏按钮显示方式 */
export const FullscreenButtonModes = ['submenu', 'control', 'hidden'] as const;
/** 全屏按钮显示方式类型 */
export type FullscreenButtonMode = (typeof FullscreenButtonModes)[number];

/** 播放模式 */
export const PlaybackModes = ['sequence', 'disabled', 'loop', 'loopAll', 'shuffle'] as const;
/** 播放模式类型 */
export type PlaybackMode = (typeof PlaybackModes)[number];

export interface IGsPlayerProps extends Omit<IPlayerProps, 'src' | 'controls'> {
	/** 视频地址 */
	src?: PlayerSource;
	/** 是否显示控制面板 */
	showControls?: boolean;
	/** 是否显示错误信息 */
	showError?: boolean;
	/** 下一个输入源 */
	nextSrc?: PlayerSource;
	/** 上一个输入源 */
	preSrc?: PlayerSource;
	/** 是否处理播放器单击，默认为true，为静音时，为取消静音，否则为切换播放 */
	handleClick?: boolean;
	/** 是否处理播放器双击，默认为true，用于 在常规状态切换到网页全屏，在任意全屏状态都是退出全屏 */
	handleDblClick?: boolean;
	/** 可改变速度的数字数组，默认为 [0.8, 1, 1.2, 1.5, 2.0, 3.0] */
	rates?: number[];
	/** 需要显示的按钮，默认为全部显示 */
	visibleItems?: ControlItemType[];
	/** 排除显示的按钮，默认为空，冲突时排除优先级更高 */
	hiddenItems?: ControlItemType[];
	/** 网页全屏挂载目标，默认为body */
	webFullscreenTarget?: string | HTMLElement;
	/** 全屏按钮显示方式，可选项为：子菜单（默认）、控制面板（最右位置）、隐藏 */
	fullscreenButtonMode?: FullscreenButtonMode;
	/** 播放列表 */
	playlist?: PlayerSource[];
	/** 播放模式，可选项为：播放下一个（默认值）、禁用、单个循环，当设置了列表字段时还支持：全部循环、随机播放 */
	mode?: PlaybackMode;
	/** 国际化配置 */
	i18n?: II18n;
	/** 键盘事件注册到的元素，默认 gs-player(需要设置可以获取焦点)；如果值为false则键盘事件无效 */
	keyboardTarget?: string | HTMLElement | false;
}

export interface IGsPlayerExpose extends Omit<IPlayerExpose, 'el' | 'play' | 'setSrc'> {


	/** 播放器实例 */
	readonly player: HTMLVideoElement;

	/**
	 * 当前播放的视频索引
	 */
	readonly index: number;


	/**
	 * 播放视频
	 * @param src 视频地址 或 索引 ( 仅当设置了列表字段时生效 )
	 */
	play(src?: number | PlayerSource): Promise<void>

	playPre(): Promise<void>

	playNext(): Promise<void>


	setSrc(src: number | PlayerSource): void;

	/** 设置音量 */
	setVolume(volume: number): void;

	/** 设置播放速度 */
	setRate(rate: number): void;

	/** 全屏 */
	fullscreen(): void;

	/** 网页全屏 */
	webFullscreen(): void;

}

export interface IGsPlayerEmits extends Omit<IPlayerEmits, 'srcChange'> {
	modeChange: (mode: string) => void
	srcChange: (src: INavPlayerSource) => void
}
