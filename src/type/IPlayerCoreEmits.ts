import {ISourceWrapper} from "./IPlayerSource";
import {PlaybackMode} from "./IPlayerCoreProps";

export interface IPlayerCoreEmits {

	srcChange: (src: ISourceWrapper) => void | Promise<void>

	srcRemove: (src: ISourceWrapper) => void | Promise<void>

	volumeChange: (volume: number) => void | Promise<void>

	mutedChange: (muted: boolean) => void | Promise<void>

	rateChange: (rate: number) => void | Promise<void>

	modeChange: (mode: PlaybackMode) => void | Promise<void>

}
