// @ts-ignore
import type { IGsPlayerProps,IGsPlayerExpose,IGsPlayerEmits,IGsPlayerSlots } from '../types'

export type GsPlayerProps = IGsPlayerProps;
export type GsPlayerEmits = IGsPlayerEmits;
export type GsPlayerInstance = IGsPlayerExpose;
export type GsPlayerSlots = IGsPlayerSlots;

export type GsPlayerComponent = {
	new (): {
		$props: GsPlayerProps
		$emit: GsPlayerEmits
		$slots: GsPlayerSlots
	} & GsPlayerInstance
}

export declare const GsPlayer: GsPlayerComponent
