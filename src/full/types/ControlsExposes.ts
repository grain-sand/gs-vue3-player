import {IGsPlayerExpose, PlayerSource} from "../../types";

export interface INavControlsExpose extends Pick<IGsPlayerExpose, 'play' | 'playPre' | 'playNext' | 'index' | 'setSrc' | 'playlist'> {
	handleEnded: Function,

}

export interface IGsFullscreenControlExpose extends Pick<IGsPlayerExpose, 'fullscreen' | 'webFullscreen' | 'isAnyFullscreen' | 'exitFullscreen'> {

	toggleWebFullscreen(): void;

	/** 切换全屏 */
	toggleFullscreen(): void;

}
