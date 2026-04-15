// noinspection TypeScriptCheckImport
import type {IGsPlayerExpose, IGsPlayerProps, IGsPlayerSlots, IGsPlayerEmits} from '../types'
import {ComponentOptionsMixin, ComputedOptions, DefineComponent, MethodOptions, SlotsType} from "vue";

/**
 * 播放器组件
 */
export declare const GsPlayer: IGsPlayerExpose
	& DefineComponent<IGsPlayerProps, {}, {}, ComputedOptions, MethodOptions, ComponentOptionsMixin, ComponentOptionsMixin, IGsPlayerEmits,
	string, {}, {}, string, SlotsType<IGsPlayerSlots>>
