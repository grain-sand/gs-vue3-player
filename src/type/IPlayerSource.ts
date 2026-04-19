import {IAuthor} from "./IAuthorProps";
import {AspectRatio} from "./IGsPlayerProps";

export const PlayerSourceTypes = ['hls', 'mp4', 'webm', 'ogg'] as const;

export type PlayerSourceType = (typeof PlayerSourceTypes)[number];

export interface IVideoQuality {
	/**
	 * 判断质量的标准
	 */
	width: number;
	/**
	 * 视频高度 备用
	 */
	height?: number;
}

export interface IVideoQualityItem extends IVideoQuality {
	url: string;
}

export interface ITypedSource<D = any, T extends string | IVideoQualityItem[] = any> {
	type?: PlayerSourceType;
	poster?: string;
	title?: string;
	src: T;
	/**
	 * 外部设置的附加数据
	 */
	data?: D;

	/**
	 * 视频时长
	 * 单位：秒
	 * 未设置时，播放器会自动回写
	 */
	duration?: number;
}

// 指定类型与URL
export interface IStringSource<D = any> extends ITypedSource<D, string> {
}

export interface IQualitiesSource<D = any> extends ITypedSource<D, Array<IVideoQualityItem>> {
}

// 输入类型
export type PlayerSource<D = any> = string | IStringSource<D> | IQualitiesSource<D>;


export interface IGsSource<D = any, T extends string | IVideoQualityItem[] = any> extends ITypedSource<D, T> {
	/**
	 * 外部设置的索引标识
	 */
	index?: number

	/**
	 * 点击时跳转到
	 */
	link?: string;

	author?: IAuthor;

	aspectRatio?: AspectRatio;

	description?: string;
}

// 指定类型与URL
export interface IGsStringSource<D = any> extends IGsSource<D, string> {
}

export interface IGsQualitiesSource<D = any> extends IGsSource<D, Array<IVideoQualityItem>> {
}

export type GsPlayerSource<D = any> = string | IGsStringSource<D> | IGsQualitiesSource<D>;

export interface ISourceWrapper<D = any, R extends GsPlayerSource<D> = GsPlayerSource<D>> extends Readonly<IGsSource<D>> {
	/**
	 * 播放器内部对源的唯一标识
	 */
	readonly _id: number

	readonly _raw: R
}
