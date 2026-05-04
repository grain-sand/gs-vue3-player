import ErrorSvg from './error.svg';
import PlaySvg from './play.svg';
import PauseSvg from './pause.svg';
import PreSvg from './pre.svg';
import NextSvg from './next.svg';
import MuteSvg from './mute.svg';
import VolumeSvg from './volume.svg';
import PlayOverlaySvg from './play-overlay.svg';
import sequence from './sequence.svg';
import disabled from './disabled.svg';
import loop from './loop-one.svg';
import loopAll from './loop-all.svg';
import shuffle from './shuffle.svg';
import WebFullscreenSvg from './web-fullscreen.svg';
import FullscreenSvg from './fullscreen.svg';
import ExitFullscreenSvg from './exit-fullscreen.svg';
import PipSvg from './pip.svg';
import ExitPipSvg from './exit-pip.svg';
import {PlaybackMode} from "../type";
import TrashSvg from './trash.svg';
import OutLinkSvg from './out-link.svg';
import {DefineComponent} from "vue";
import PinSvg from './pin.svg';
import LinkSvg from './link.svg';
import AutoSvg from './auto.svg';

// 类型断言，确保 svg 文件被正确识别为组件
export const PlaybackModeIcons: Record<PlaybackMode, DefineComponent> = {
	sequence,
	disabled,
	loop,
	loopAll,
	shuffle,
	deleteAfterPlay: TrashSvg
} as any;

export const PlayStateIcons: Record<'true' | 'false', DefineComponent> = {
	'true': PauseSvg,
	'false': PlaySvg
} as any;

export const VolumeStateIcons: Record<'true' | 'false', DefineComponent> = {
	'true': MuteSvg,
	'false': VolumeSvg
} as any;

export {
	ErrorSvg,
	PreSvg,
	NextSvg,
	WebFullscreenSvg,
	FullscreenSvg,
	ExitFullscreenSvg,
	PipSvg,
	ExitPipSvg,
	PlayOverlaySvg,
	MuteSvg,
	TrashSvg,
	OutLinkSvg,
	PinSvg,
	LinkSvg,
	AutoSvg,
};
