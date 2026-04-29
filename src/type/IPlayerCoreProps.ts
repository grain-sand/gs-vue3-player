import {IVideoQuality, PlaySource} from "./IPlayerSource";
import {HlsConfig} from "hls.js";
import {PlaybackMode} from "./UnionTypes";


export interface IPlayerCoreProps {

	/** 视频地址 */
	src?: PlaySource;

	/** hls.js 的实例化配置项（当播放 m3u8 时生效） */
	hlsConfig?: Partial<HlsConfig>;

	/** 视频质量 */
	quality?: IVideoQuality;

	useBrowserHls?: boolean;

	rate?: number;

	autoplay?: boolean;

	volume?: number;

	controls?: boolean;

	muted?: boolean;

	/** 下一个输入源 */
	nextSrc?: PlaySource;

	/** 上一个输入源 */
	preSrc?: PlaySource;
	/** 播放列表 */
	playlist?: PlaySource[];
	/** 播放模式，可选项为：播放下一个（默认值）、禁用、单个循环，当设置了列表字段时还支持：全部循环、随机播放 */
	mode?: PlaybackMode;

}
