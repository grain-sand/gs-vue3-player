// noinspection TypeScriptCheckImport
import type {IGsPlayerExpose, IGsPlayerProps, IGsPlayerSlots, IGsPlayerEmits} from '../types'
import {ComponentOptionsMixin, ComputedOptions, DefineComponent, MethodOptions} from "vue";

/**
 * 播放器组件
 */
export declare const GsPlayer: IGsPlayerExpose
	& DefineComponent<IGsPlayerProps, IGsPlayerSlots, {}, ComputedOptions, MethodOptions, ComponentOptionsMixin, ComponentOptionsMixin, IGsPlayerEmits>;
