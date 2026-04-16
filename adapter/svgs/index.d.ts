// noinspection TypeScriptCheckImport
import { PlaybackMode } from "../types";
import {DefineComponent} from "vue";
export type SvgComponent = DefineComponent<{}, {}, any>

export declare const ErrorSvg:SvgComponent
export declare const PreSvg:SvgComponent
export declare const NextSvg:SvgComponent
export declare const WebFullscreenSvg:SvgComponent
export declare const FullscreenSvg:SvgComponent
export declare const PipSvg:SvgComponent
export declare const PlayOverlaySvg:SvgComponent
export declare const MuteSvg:SvgComponent

export declare const PlaybackModeIcons: Record<PlaybackMode, SvgComponent>;
export declare const PlayStateIcons: Record<'true' | 'false', SvgComponent>;
export declare const VolumeStateIcons: Record<'true' | 'false', SvgComponent>;

