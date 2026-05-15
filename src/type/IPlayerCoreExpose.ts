import {ISourceWrapper, IVideoQuality, PlaySource} from "./IPlayerSource";
import {AspectRatio, PlaybackMode} from "./UnionTypes";

export interface IPlayerCoreExpose<Data = any, Source extends PlaySource<Data> = PlaySource<Data>, Wrapper extends ISourceWrapper<Data, Source> = ISourceWrapper<Data, Source>> {

	readonly el: HTMLVideoElement

	volume: number

	muted: boolean

	time: number

	readonly duration: number

	rate: number

	src: Wrapper

	/** 播放模式，可选项为：播放下一个（默认值）、禁用、单个循环，当设置了列表字段时还支持：全部循环、随机播放 */
	mode?: PlaybackMode;

	readonly playing: boolean

	readonly error?: MediaError

	readonly playlist: Wrapper[]
	/**
	 * 当前播放的视频索引
	 */
	readonly index: number;
	/** 下一个输入源 */
	readonly nextSrc?: Source;
	/** 上一个输入源 */
	readonly preSrc?: Source;

	/** 是否有上一个可播放 */
	readonly hasPre: boolean;

	/** 是否有下一个可播放 */
	readonly hasNext: boolean;

	readonly bestQuality: Partial<IVideoQuality> | undefined
	/**
	 * 当前是否在画中画模式
	 */
	readonly pipState: boolean;
	/**
	 * 是否支持画中画功能
	 */
	readonly supportsPip: boolean;
	/**
	 * video 元素已经缓冲的详细时间片段，格式如 [[1,5],[15,30]]
	 */
	readonly buffered: number[][];
	/**
	 * 当前视频的实时尺寸（宽高比）
	 */
	readonly size: AspectRatio;
	/**
	 * video 元素的 style 属性
	 */
	readonly style: CSSStyleDeclaration;

	play(src?: Source): Promise<void>

	/**
	 * 设置当前播放的视频源
	 * - 如果未在播放列表中，则将添加到播放列表
	 * @param src
	 */
	setSrc(src: Source): void

	/**
	 * 从播放列表中移除视频源
	 * @param src
	 */
	removeSrc(src: Source | Wrapper): void

	/**
	 * 向播放列表中插入视频源
	 * @param src
	 * @param index 插入位置，默认值为`-1`,表示插入到播放列表末尾
	 */
	insertSrc(src: Source | Source[], index?: number): void

	togglePlay(): Promise<void>

	pause(): Promise<void>

	unmute(): Promise<void>

	toBestQuality(reference: Partial<IVideoQuality>, now?: boolean): void

	autoQualityHls(): void

	playPre(): Promise<void>

	playNext(): Promise<void>

	/**
	 * 进入画中画模式
	 */
	enterPip(): Promise<void>;

	/**
	 * 退出画中画模式
	 */
	exitPip(): Promise<void>;

	/**
	 * 切换画中画模式
	 */
	togglePip(): Promise<void>;

}
