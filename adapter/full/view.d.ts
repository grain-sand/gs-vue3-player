// noinspection TypeScriptCheckImport
import type {IGsPlayerExpose, IGsPlayerProps, IGsPlayerSlots, PlayerSource} from '../types'
import {ComponentOptionsMixin, ComputedOptions, DefineComponent, MethodOptions} from "vue";
/**
 * 播放器组件
 */
export declare const GsPlayer: IGsPlayerExpose
	& DefineComponent<IGsPlayerProps, IGsPlayerSlots, {}, ComputedOptions, MethodOptions, ComponentOptionsMixin, ComponentOptionsMixin
	, {
	srcChange: (src: PlayerSource) => void
	volumeChange: (volume: number) => void
	playbackModeChange: (mode: string) => void
	playbackRateChange: (rate: number) => void
}>;
