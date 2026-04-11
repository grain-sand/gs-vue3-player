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

export interface ITypedPlayerSource<T extends string | IVideoQualityItem[]> {
	type: PlayerSourceType;
	poster?: string;
	title?: string;
	src: T;
}

// 指定类型与URL
export interface IStringPlayerSource extends ITypedPlayerSource<string> {
}

export interface IQualitiesPlayerSource extends ITypedPlayerSource<Array<IVideoQualityItem>> {
}

// 输入类型
export type PlayerSource = string | IStringPlayerSource | IQualitiesPlayerSource;
