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

export interface ITypedPlayerSource<D = any, T extends string | IVideoQualityItem[] = any> {
	type?: PlayerSourceType;
	poster?: string;
	title?: string;
	src: T;
	/**
	 * 用于设置的附加数据
	 */
	_raw?: D;
}

// 指定类型与URL
export interface IStringPlayerSource<D = any> extends ITypedPlayerSource<D, string> {
}

export interface IQualitiesPlayerSource<D = any> extends ITypedPlayerSource<D, Array<IVideoQualityItem>> {
}

// 输入类型
export type PlayerSource<D = any> = string | IStringPlayerSource<D> | IQualitiesPlayerSource<D>;

export interface IAuthor {
	profile_image?: string;
	name: string;
	link?: string;
}


export interface IGsPlayerSource<D = any, T extends string | IVideoQualityItem[] = any> extends ITypedPlayerSource<D, T> {
	/**
	 * 用于设置的标识索引的值
	 */
	_id?: number

	/**
	 * 点击时跳转到
	 */
	link?: string;

}

// 指定类型与URL
export interface IStringGsSource<D = any> extends IGsPlayerSource<D, string> {
}

export interface IQualitiesGsSource<D = any> extends IGsPlayerSource<D, Array<IVideoQualityItem>> {
}

export type GsPlayerSource<D = any> = string | IStringGsSource<D> | IQualitiesGsSource<D>;

export interface ISourceWrapper<D=any,R extends GsPlayerSource<D> = GsPlayerSource<D>> extends Readonly<IGsPlayerSource> {
	/**
	 * 播放器内部对源的唯一标识
	 */
	readonly _id: number

	readonly _raw: R
}
