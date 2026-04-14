import type {
	ComponentProps,
	ComponentAttrs,
	ComponentEmit,
	ComponentExposed,
	ComponentSlots
} from 'vue-component-type-helpers'
import GsPlayer from './GsPlayer.vue';

export type GsPlayerProps = ComponentProps<typeof GsPlayer>
export type GsPlayerAttrs = ComponentAttrs<typeof GsPlayer>
export type GsPlayerEmits = ComponentEmit<typeof GsPlayer>
export type GsPlayerExposed = ComponentExposed<typeof GsPlayer>
export type GsPlayerSlots = ComponentSlots<typeof GsPlayer>
export {GsPlayer};
