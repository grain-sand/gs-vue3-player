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

export interface ITypedPlayerSource<T extends string | IVideoQualityItem[], D=any> {
	type: PlayerSourceType;
	poster?: string;
	title?: string;
	src: T;
	data?: D;
}

// 指定类型与URL
export interface IStringPlayerSource<D=any> extends ITypedPlayerSource<string, D> {
}

export interface IQualitiesPlayerSource<D=any> extends ITypedPlayerSource<Array<IVideoQualityItem>, D> {
}

// 输入类型
export type PlayerSource<D = any> = string | IStringPlayerSource<D> | IQualitiesPlayerSource<D>;
