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
import TransformSvg from './transform.svg';
import MoveSvg from './move.svg';
import FlipSvg from './flip.svg';
import RotateSvg from './rotate.svg';
import FitSvg from './fit.svg';
import DownloadSvg from './download.svg';
import UserSvg from './user.svg';
import InfoSvg from './info.svg';
import ListSvg from './list.svg';
import HelpSvg from './help.svg';
import CloseSvg from './close.svg';
import DateSvg from './date.svg';
import VerifiedSvg from './verified.svg';
import VipSvg from './vip.svg';
import SvipSvg from './svip.svg';
import SupperSvg from './supper.svg';
import {AuthorType} from "../type";

export const AuthorTypeIcons: Record<AuthorType, DefineComponent | null> = {
	none: null,
	blue: VerifiedSvg,
	government: VerifiedSvg,
	business: VerifiedSvg,
	vip: VipSvg,
	svip: SvipSvg,
	supper: SupperSvg
} as any;

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
	TransformSvg,
	MoveSvg,
	FlipSvg,
	RotateSvg,
	FitSvg,
	PauseSvg,
	DownloadSvg,
	UserSvg,
	InfoSvg,
	ListSvg,
	HelpSvg,
	CloseSvg,
	DateSvg
};
