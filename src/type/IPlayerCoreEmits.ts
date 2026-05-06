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

	srcChange: (src: ISourceWrapper) => void | Promise<void>

	srcRemove: (src: ISourceWrapper) => void | Promise<void>

	volumeChange: (volume: number) => void | Promise<void>

	mutedChange: (muted: boolean) => void | Promise<void>

	rateChange: (rate: number) => void | Promise<void>

	modeChange: (mode: PlaybackMode) => void | Promise<void>

}

export interface IPlayerCoreEmits extends IPlayerCoreMouseEmits, IPlayerCoreMediaEmits {

}
