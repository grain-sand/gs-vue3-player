import {IAuthor} from "./IAuthorProps";
import {AspectRatio, PlaySourceType} from "./UnionTypes";


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

	type?: PlaySourceType;

	poster?: string;


	/**
	 * 视频标题
	 * - 始终使用 `v-text` 渲染
	 */
	title?: string;

	src: T;
	/**
	 * 外部设置的附加数据
	 */
	data?: D;

	/**
	 * 视频参考时长
	 * 单位：秒
	 * 未设置时，播放器会自动回写
	 */
	duration?: number;

	/**
	 * 点击时跳转链接
	 */
	link?: string;

	/**
	 * 视频作者
	 */
	author?: IAuthor;

	/**
	 * 视频宽高比
	 */
	aspectRatio?: AspectRatio;

	/**
	 * 视频描述
	 * - 始终使用 `v-html` 渲染
	 */
	description?: string;
}

// 指定类型与URL
export interface IStringSource<D = any> extends ITypedSource<D, string> {
}

export interface IQualitiesSource<D = any> extends ITypedSource<D, Array<IVideoQualityItem>> {
}

// 输入类型
export type PlaySource<D = any> = string | IStringSource<D> | IQualitiesSource<D>;


export interface ISourceWrapper<D = any, R extends PlaySource<D> = PlaySource<D>> extends ITypedSource<D> {
	/**
	 * 播放器内部对源的唯一标识
	 */
	readonly _id: number

	readonly _raw: R
}
