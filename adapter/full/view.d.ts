// noinspection TypeScriptCheckImport
import type {IGsPlayerEmits, IGsPlayerExpose, IGsPlayerProps, IGsPlayerSlots} from '../types'
import {
	ComponentOptionsMixin,
	ComponentPropsOptions,
	ComputedOptions,
	DefineComponent,
	EmitsOptions,
	EmitsToProps,
	ExtractPropTypes,
	MethodOptions,
	PublicProps,
	SlotsType
} from "vue";


type ResolveProps<PropsOrPropOptions, E extends EmitsOptions> =
	Readonly<PropsOrPropOptions extends ComponentPropsOptions ? ExtractPropTypes<PropsOrPropOptions> : PropsOrPropOptions>
	& ({} extends E ? {} : EmitsToProps<E>);

/**
 * 播放器组件
 */
export declare const GsPlayer: IGsPlayerExpose & DefineComponent<
	IGsPlayerProps,
	{}, {}, ComputedOptions, MethodOptions, ComponentOptionsMixin, ComponentOptionsMixin,
	IGsPlayerEmits,
	string, PublicProps, ResolveProps<IGsPlayerProps, IGsPlayerEmits>, string,
	SlotsType<IGsPlayerSlots>
>


