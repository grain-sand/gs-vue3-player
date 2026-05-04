import {AspectRatioMode, LayoutMode, VisibilityMode} from "./UnionTypes";
import {IPlayerCoreExpose} from "./IPlayerCoreExpose";
import {DefineComponent} from "vue";
import {IGsPlayerProps} from "./IGsPlayerProps";
import {II18n} from "./II18n";


export interface IGsWidgetContext {

	controlVisibility: VisibilityMode;

	listVisibility: VisibilityMode;

	readonly layout: LayoutMode;

	/**
	 * 视频比例
	 */
	aspectRatio: AspectRatioMode

	readonly i18n: II18n;

	/**
	 * 是否全屏模式
	 * - 包括 网页全屏 和 桌面全屏
	 */
	readonly isFullscreen: boolean;

	/**
	 * 容器元素
	 * - 是 GsPlayer.vue <teleport> 内的根元素
	 */
	readonly container: HTMLElement;

	/**
	 * 容器宽度（实时）
	 */
	readonly containerWidth: number;

	/**
	 * 容器高度（实时）
	 */
	readonly containerHeight: number;

	/**
	 * 更新容器实时尺寸（内部使用）
	 */
	updateContainerSize(width: number, height: number): void;

	/** 桌面全屏 */
	fullscreen(): void;

	/** 网页全屏 */
	webFullscreen(): void;

	/**
	 * 退出任意全屏模式
	 */
	exitFullscreen(): void;

	setLayout(layout: LayoutMode): void;

	toggleListVisibility(): void;
}

export interface IGsWidgetProps {

	readonly core: IPlayerCoreExpose;

	readonly cxt: IGsWidgetContext;

	readonly props: Readonly<IGsPlayerProps>

}

export type IGsWidget<P extends IGsWidgetProps = any> = DefineComponent<P, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>

export interface IGsLogic {

	mount(param: IGsWidgetProps): void | Promise<void>;

	/**
	 * 卸载逻辑组件
	 * - 可选
	 * @param param
	 */
	unmount?(param: IGsWidgetProps): void | Promise<void>;
}
