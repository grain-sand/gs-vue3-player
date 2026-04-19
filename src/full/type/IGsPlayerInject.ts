import type {ControlItemType, IGsPlayerExpose, IGsPlayerProps, IPlayerExpose, PlaybackMode} from '../../type';
import {Ref} from "vue";

/**
 * 播放器依赖注入接口
 */
export interface IGsPlayerInject extends Pick<IGsPlayerExpose, "toBestQuality" | 'togglePlay' | 'play' | 'pause' | 'unmute' | 'setRate' | 'setVolume' | 'setMode' | 'playlist' | 'src' | 'removePlaylistItem'|'index'>  {
	// 状态
	currentMode: PlaybackMode;

	// 计算属性
	controlsVisibility: Record<ControlItemType, boolean>;
	// Props
	props: IGsPlayerProps;

	// Refs
	playerRef: Ref<IPlayerExpose>;

	containerRef: Ref<HTMLDivElement>;

	isWebFullscreen: { value: boolean };

	emit: (e: string, ...arg: any) => void;
}

/**
 * 依赖注入的键
 */
export const GsPlayerInjectKey = Symbol('PlayerInject');
