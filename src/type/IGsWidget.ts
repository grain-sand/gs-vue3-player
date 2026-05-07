import {AspectRatioMode, LayoutMode, VisibilityMode} from "./UnionTypes";
import {IPlayerCoreExpose} from "./IPlayerCoreExpose";
import {DefineComponent} from "vue";
import {IGsPlayerProps} from "./IGsPlayerProps";
import {II18n} from "./II18n";

export interface ITransformState {
	draggable: boolean;
	flipHorizontal: boolean;
	flipVertical: boolean;
	rotation: number;
	scaleMode: 'fit' | 'auto' | number;
	translateX: number;
	translateY: number;
}

export interface IGsWidgetContext {

	controlVisibility: VisibilityMode;

	listVisibility: VisibilityMode;

	readonly layout: LayoutMode;

	/** 是否显示信息面板 */
	infoPanelVisible: boolean;

	/**
	 * 是否显示上下文菜单
	 */
	contextMenuVisible: boolean;

	/** 是否处理播放器单击，默认为true，为静音时，为取消静音，否则为切换播放 */

	handleClick: boolean;

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

	/**
	 * 变换状态
	 */
	readonly transformState: ITransformState;

	/**
	 * 变换状态是否被改变
	 */
	readonly hasTransformChanged: boolean;

	/**
	 * 重置所有变换
	 */
	resetTransform(): void;

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
