import {ISourceWrapper} from "./IPlayerSource";
import {PlaybackMode} from "./UnionTypes";

export interface IPlayerCoreMouseEmits {

	mousedown: (e: MouseEvent) => void | Promise<void>

	mousemove: (e: MouseEvent) => void | Promise<void>

	mouseup: (e: MouseEvent) => void | Promise<void>

	mouseleave: (e: MouseEvent) => void | Promise<void>

	touchstart: (e: TouchEvent) => void | Promise<void>

	touchmove: (e: TouchEvent) => void | Promise<void>

	touchend: (e: TouchEvent) => void | Promise<void>

}

export interface IPlayerCoreMediaEmits {

	/**
	 * 当前播放源改变后触发
	 * @param src
	 */
	srcChanged: (src: ISourceWrapper) => void | Promise<void>

	/**
	 * 从播放列表移除后触发
	 * @param src
	 */
	srcRemoved: (src: ISourceWrapper) => void | Promise<void>

	/**
	 * 插入播放列表后触发
	 * @param src
	 */
	srcInserted: (src: ISourceWrapper[]) => void | Promise<void>

	/**
	 * 音量改变后触发
	 * @param volume
	 */
	volumeChanged: (volume: number) => void | Promise<void>

	/**
	 * 静音状态改变后触发
	 * @param muted
	 */
	mutedChanged: (muted: boolean) => void | Promise<void>

	/**
	 * 播放速率改变后触发
	 * @param rate
	 */
	rateChanged: (rate: number) => void | Promise<void>

	/**
	 * 播放模式改变后触发
	 * @param mode
	 */
	modeChanged: (mode: PlaybackMode) => void | Promise<void>

}

export interface IPlayerCoreEmits extends IPlayerCoreMouseEmits, IPlayerCoreMediaEmits {

}
