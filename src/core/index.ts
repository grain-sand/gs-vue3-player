import type {ComponentProps, ComponentAttrs, ComponentEmit, ComponentExposed} from 'vue-component-type-helpers'
import Player from './Player.vue';

export {Player};

export type PlayerProps = ComponentProps<typeof Player>
export type PlayerAttrs = ComponentAttrs<typeof Player>
export type PlayerEmits = ComponentEmit<typeof Player>
export type PlayerExposed = ComponentExposed<typeof Player>
