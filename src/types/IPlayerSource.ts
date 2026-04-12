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
	type: PlayerSourceType;
	poster?: string;
	title?: string;
	src: T;
	data?: D;
}

// 指定类型与URL
export interface IStringPlayerSource<D = any> extends ITypedPlayerSource<D, string> {
}

export interface IQualitiesPlayerSource<D = any> extends ITypedPlayerSource<D, Array<IVideoQualityItem>> {
}

// 输入类型
export type PlayerSource<D = any> = string | IStringPlayerSource<D> | IQualitiesPlayerSource<D>;
