import type {ControlItemType, IGsPlayerProps, IPlayerExpose, PlaybackMode} from '../../types';

/**
 * 播放器依赖注入接口
 */
export interface IPlayerInject extends Pick<IGsPlayerProps, 'pause' | 'setVolume' | 'toBestQuality' | 'setRate' | 'unmute' | 'play'> {
	// 状态
	currentMode: PlaybackMode;
	currentIndex: number;
	// 计算属性
	controlsVisibility: Record<ControlItemType, boolean>;
	// Props
	props: IGsPlayerProps;
	// 方法
	togglePlay: () => Promise<void>;

	setMode: (mode: string) => void;
	// Refs
	playerRef: { value: IPlayerExpose | undefined };

	isWebFullscreen: { value: boolean };

	emit: (e: string, ...arg: any) => void;
}

/**
 * 依赖注入的键
 */
export const PlayerInjectKey = Symbol('PlayerInject');
