import {AspectRatioMode, LayoutMode} from "./GsUnionTypes";
import {IPlayerCoreExpose} from "./IPlayerCoreExpose";
import {DefineComponent} from "vue";
import {PlayerCore} from "../core";


export interface IGsWidgetContext {

	/**
	 * 是否全屏模式
	 * - 包括 网页全屏 和 桌面全屏
	 */
	readonly isFullscreen: boolean;

	readonly aspectRatio: AspectRatioMode

	readonly layout: LayoutMode

	/** 桌面全屏 */
	fullscreen(): void;

	/** 网页全屏 */
	webFullscreen(): void;

	/**
	 * 退出任意全屏模式
	 */
	exitFullscreen(): void;

	setLayout(layout: LayoutMode): void;

}

export interface IGsWidgetProps {

	readonly core: IPlayerCoreExpose;

	readonly cxt: IGsWidgetContext;

}

export type IGsWidget<P extends IGsWidgetProps=any> = DefineComponent<P, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>
