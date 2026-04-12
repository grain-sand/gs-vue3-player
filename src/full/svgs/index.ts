import ErrorSvg from './error.svg';
import PlaySvg from './play.svg';
import PauseSvg from './pause.svg';
import PreSvg from './pre.svg';
import NextSvg from './next.svg';
import MuteSvg from './mute.svg';
import VolumeSvg from './volume.svg';
import sequence from './sequence.svg';
import disabled from './disabled.svg';
import loop from './loop-one.svg';
import loopAll from './loop-all.svg';
import shuffle from './shuffle.svg';
import WebFullscreenSvg from './web-fullscreen.svg';
import FullscreenSvg from './fullscreen.svg';
import PipSvg from './pip.svg';
import {PlaybackMode} from "../../types";

// 类型断言，确保 svg 文件被正确识别为组件
export const PlaybackModeIcons: Record<PlaybackMode, any> = {
	sequence,
	disabled,
	loop,
	loopAll,
	shuffle
};

export const PlayStateIcons: Record<'true' | 'false', any> = {
	'true': PauseSvg,
	'false': PlaySvg
};

export const VolumeStateIcons: Record<'true' | 'false', any> = {
	'true': MuteSvg,
	'false': VolumeSvg
};

export {
	ErrorSvg,
	PreSvg,
	NextSvg,
	WebFullscreenSvg,
	FullscreenSvg,
	PipSvg
};
