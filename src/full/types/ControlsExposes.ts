import {IGsPlayerExpose} from "../../types";

export interface INavControlsExpose extends Pick<IGsPlayerExpose, 'play' | 'playPre' | 'playNext' | 'index'> {
	handleEnded: Function,
}

export interface IGsFullscreenControlExpose extends Pick<IGsPlayerExpose, 'fullscreen' | 'webFullscreen'> {

	readonly isAnyFullscreen: boolean;

	toggleWebFullscreen(): void;

	/** 切换全屏 */
	toggleFullscreen(): void;

	/**
	 * 退出任意全屏模式
	 */
	exitFullscreen(): void;

}
