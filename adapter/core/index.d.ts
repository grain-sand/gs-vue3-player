// noinspection TypeScriptCheckImport
import type {IPlayerExpose, IPlayerProps, PlayerSource} from '../types'
import {ComponentOptionsMixin, ComputedOptions, DefineComponent, MethodOptions} from "vue";
/**
 * 播放器组件
 */
export declare const Player: IPlayerExpose
	& DefineComponent<IPlayerProps, {}, {}, ComputedOptions, MethodOptions, ComponentOptionsMixin, ComponentOptionsMixin
	, {
	srcChange: (src: PlayerSource) => void
}>;

