import {IPlayerExpose} from "./IPlayerProps";
import {GsPlayerSource, ISourceWrapper, IVideoQuality} from "./IPlayerSource";
import {AspectRatio, PlaybackMode} from "./IGsPlayerProps";


export interface IGsPlayerExpose extends Omit<IPlayerExpose, 'el' | 'play' | 'setSrc' | 'toBestQuality'> {


	/** 播放器实例 */
	readonly player: HTMLVideoElement;

	readonly playlist: ISourceWrapper[]

	/**
	 * 当前播放的视频索引
	 */
	readonly index: number;

	setMode: (mode: PlaybackMode) => void;

	readonly isAnyFullscreen: boolean;

	readonly aspectRatio?: AspectRatio | 'auto'

	/**
	 * 播放视频
	 * @param src 视频地址 或 索引 ( 仅当设置了列表字段时生效 )
	 */
	play(src?: number | GsPlayerSource): Promise<void>

	playPre(): Promise<void>

	playNext(): Promise<void>

	setSrc(src: number | GsPlayerSource): void;

	/** 设置音量 */
	setVolume(volume: number): void;

	/** 设置播放速度 */
	setRate(rate: number): void;

	/** 全屏 */
	fullscreen(): void;

	/** 网页全屏 */
	webFullscreen(): void;

	toBestQuality(reference?: Partial<IVideoQuality>, now?: boolean): void

	/**
	 * 退出任意全屏模式
	 */
	exitFullscreen(): void;

}
