import type {VideoHTMLAttributes} from 'vue';
import {HlsConfig} from "hls.js";
import {IVideoQuality, PlayerSource} from "./IPlayerSource";

/**
 * Interface：播放器组件的 Props
 * 继承原生 Video 属性以保证完美的类型推导
 */
export interface IPlayerProps extends /* @vue-ignore */ Omit<VideoHTMLAttributes, 'src'> {
	/** 视频地址 */
	src: PlayerSource;
	/** hls.js 的实例化配置项（当播放 m3u8 时生效） */
	hlsConfig?: Partial<HlsConfig>;

	/** 视频质量 */
	quality?: IVideoQuality;

	useBrowserHls?: boolean;

}

export interface IPlayerExpose {

	readonly el: HTMLVideoElement

	readonly volume: number

	readonly muted: boolean

	readonly time: number

	readonly duration: number

	readonly rate: number

	readonly playing: boolean

	readonly error?: MediaError

	play(src?: PlayerSource): Promise<void>

	setSrc(src?: PlayerSource): void

	togglePlay(): Promise<void>

	pause(): Promise<void>

	setVolume(volume: number): void

	unmute(): Promise<void>

}

export interface IPlayerEmits {
	srcChange: (src: PlayerSource) => void
	volumeChange: (volume: number) => void
	mutedChange: (muted: boolean) => void
}
