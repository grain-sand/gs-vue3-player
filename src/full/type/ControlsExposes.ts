import {IGsPlayerExpose} from "../../type";

export interface INavControlsExpose extends Pick<IGsPlayerExpose, 'play' | 'playPre' | 'playNext' | 'index' | 'setSrc' | 'playlist' | 'removePlaylistItem'> {
	handleEnded: Function,

}

export interface IGsFullscreenControlExpose extends Pick<IGsPlayerExpose, 'fullscreen' | 'webFullscreen' | 'isAnyFullscreen' | 'exitFullscreen'> {

	toggleWebFullscreen(): void;

	/** 切换全屏 */
	toggleFullscreen(): void;

}

export interface IFloatingPanelsExpose {
	titlePanel: HTMLDivElement
	rightPanel: HTMLDivElement
	floating?: boolean
}
