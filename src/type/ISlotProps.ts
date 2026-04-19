import {VNode} from "vue";
import {IGsPlayerExpose} from "./IGsPlayerExpose";

export const ControlItemTypes = ['play', 'pre', 'next', 'time', 'speed', 'volume', 'fullscreen', 'progress', 'playOverlay'] as const;

export type ControlItemType = (typeof ControlItemTypes)[number];

/** 进度条插槽接口 */
export interface IProgressSlotProps {
	/** 当前进度（0-100） */
	progress: number;
	/** 当前时间 */
	currentTime: number;
	/** 总时长 */
	duration: number;
	/** 处理进度条点击 */
	handleProgressClick: (e: MouseEvent) => void;
	/** 处理进度条鼠标移动 */
	handleProgressMouseMove: (e: MouseEvent) => void;
	/** 处理进度条鼠标离开 */
	handleProgressMouseLeave: () => void;
}

/** 控制面板插槽接口 */
export interface IControlsSlotProps extends IProgressSlotProps {
	/** 播放状态 */
	isPlaying: boolean;
	/** 静音状态 */
	isMuted: boolean;
	/** 网页全屏状态 */
	isWebFullscreen: boolean;
	/** 播放速度 */
	playbackRate: number;
	/** 音量 */
	volume: number;
	/** 控制按钮可见性 */
	controlsVisibility: Record<ControlItemType, boolean>;
	/** 切换播放/暂停 */
	togglePlay: () => Promise<void>;
	/** 播放 */
	play: (src?: any) => Promise<void>;
	/** 暂停 */
	pause: () => Promise<void>;
	/** 取消静音 */
	unmute: () => Promise<void>;
	/** 切换静音 */
	toggleMute: () => void;
	/** 设置音量 */
	setVolume: (volume: number) => void;
	/** 设置播放速度 */
	setRate: (rate: number) => void;
	/** 切换到上一个输入源 */
	switchToPreSrc: () => void;
	/** 切换到下一个输入源 */
	switchToNextSrc: () => void;
	/** 全屏 */
	fullscreen: () => void;
	/** 网页全屏 */
	webFullscreen: () => void;
	/** 格式化时间 */
	formatTime: (seconds: number) => string;
}

export interface IPlaylistSlotProps extends Pick<IGsPlayerExpose, 'playlist' | 'src' | 'play'> {
}


export interface IGsPlayerSlots {

	default(props: IControlsSlotProps): VNode[] | VNode

	footer(props: IControlsSlotProps): VNode[] | VNode

	buttons(props: IControlsSlotProps): VNode[] | VNode

	progress(props: IProgressSlotProps): VNode[] | VNode

	infoPanel(props: IPlaylistSlotProps): VNode[] | VNode

	playlist(props: IPlaylistSlotProps): VNode[] | VNode

}
