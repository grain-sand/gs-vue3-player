import type {ControlItemType, IGsPlayerProps, IPlayerExpose, PlaybackMode} from '../../types';

/**
 * 播放器依赖注入接口
 */
export interface IPlayerInject {
	// 状态
	currentMode: PlaybackMode;
	currentIndex: number;
	// 计算属性
	controlsVisibility: Record<ControlItemType, boolean>;
	progress: number;
	availableModes: Array<{
		value: PlaybackMode;
		text: string;
	}>;
	// Props
	props: IGsPlayerProps;
	// 方法
	togglePlay: () => Promise<void>;
	play: (src?: any) => Promise<void>;
	pause: () => Promise<void>;
	unmute: () => Promise<void>;
	setPlaybackMode: (mode: string) => void;
	setPlaybackRate: (rate: number) => void;
	setVolume: (volume: number) => void;
	fullscreen: () => void;
	webFullscreen: () => void;
	pip: () => void;
	// Refs
	playerRef: { value: IPlayerExpose | undefined };

	emit: (e: string, ...arg: any) => void;
}

/**
 * 依赖注入的键
 */
export const PlayerInjectKey = Symbol('PlayerInject');
