// @ts-ignore
import type { IPlayerProps, IPlayerExpose, IPlayerEmits } from '../types'

export type PlayerProps = IPlayerProps

export type PlayerInstance = IPlayerExpose

export type PlayerEmits = IPlayerEmits

export type PlayerComponent = {
	new (): {
		$props: PlayerProps
		$emit: PlayerEmits
	} & PlayerInstance
}

export declare const Player: PlayerComponent

