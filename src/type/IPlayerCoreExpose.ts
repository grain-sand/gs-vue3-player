import {ISourceWrapper, IVideoQuality, PlaySource} from "./IPlayerSource";
import {PlaybackMode} from "./IPlayerCoreProps";

export interface IPlayerCoreExpose {

	readonly el: HTMLVideoElement

	volume: number

	muted: boolean

	time: number

	readonly duration: number

	rate: number

	src: PlaySource

	/** 播放模式，可选项为：播放下一个（默认值）、禁用、单个循环，当设置了列表字段时还支持：全部循环、随机播放 */
	mode?: PlaybackMode;

	readonly playing: boolean

	readonly error?: MediaError

	readonly playlist: ISourceWrapper[]
	/**
	 * 当前播放的视频索引
	 */
	readonly index: number;
	/** 下一个输入源 */
	readonly nextSrc?: PlaySource;
	/** 上一个输入源 */
	readonly preSrc?: PlaySource;

	readonly bestQuality: Partial<IVideoQuality> | undefined

	play(src?: PlaySource): Promise<void>

	/**
	 * 设置当前播放的视频源
	 * - 如果未在播放列表中，则将添加到播放列表
	 * @param src
	 */
	setSrc(src: PlaySource): void

	/**
	 * 从播放列表中移除视频源
	 * @param src
	 */
	removeSrc(src: PlaySource): void

	togglePlay(): Promise<void>

	pause(): Promise<void>

	unmute(): Promise<void>

	toBestQuality(reference: Partial<IVideoQuality>, now?: boolean): void

	autoQualityHls(): void

	playPre(): Promise<void>

	playNext(): Promise<void>

}
