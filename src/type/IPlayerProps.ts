import {HlsConfig} from "hls.js";
import {IVideoQuality, PlayerSource} from "./IPlayerSource";

/**
 * Interface：播放器组件的 Props
 * 继承原生 Video 属性以保证完美的类型推导
 */
export interface IPlayerProps {
	/** 视频地址 */
	src?: PlayerSource;
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

}

export interface IPlayerExpose {

	readonly el: HTMLVideoElement

	volume: number

	muted: boolean

	time: number

	readonly duration: number

	rate: number

	src: PlayerSource

	readonly playing: boolean

	readonly error?: MediaError

	play(src?: PlayerSource): Promise<void>

	setSrc(src?: PlayerSource): void

	togglePlay(): Promise<void>

	pause(): Promise<void>

	setVolume(volume: number): void

	unmute(): Promise<void>

	toBestQuality(reference: Partial<IVideoQuality>, now?: boolean): void

	autoQualityHls(): void

}

export interface IPlayerEmits {
	srcChange: (src: PlayerSource) => void
	volumeChange: (volume: number) => void
	mutedChange: (muted: boolean) => void
	rateChange: (rate: number) => void
}
