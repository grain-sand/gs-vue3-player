// noinspection TypeScriptCheckImport
import type {IPlayerEmits, IPlayerExpose, IPlayerProps} from '../types'
import {ComponentOptionsMixin, ComputedOptions, DefineComponent, MethodOptions} from "vue";

/**
 * 播放器组件
 */
export declare const Player: IPlayerExpose
	& DefineComponent<IPlayerProps, {}, {}, ComputedOptions, MethodOptions, ComponentOptionsMixin, ComponentOptionsMixin, IPlayerEmits>;

