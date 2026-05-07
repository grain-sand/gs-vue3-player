import {AspectRatio, AspectRatioMode, LayoutMode, VisibilityMode} from "./UnionTypes";
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
	 * `GsPlayer.vue` 根元素
	 * - 是 GsPlayer.vue <teleport> 内的根元素
	 */
	readonly playerRoot: HTMLElement;

	/**
	 * 包裹`<video />` 的元素
	 */
	readonly videoWrapper: HTMLElement;

	/**
	 * 视频容器元素实时尺寸（实时）
	 * - 格式：[width, height]
	 */
	readonly wrapperSize: AspectRatio

	/**
	 * 根元素宽度（实时）
	 */
	readonly rootWidth: number;

	/**
	 * 根元素高度（实时）
	 */
	readonly rootHeight: number;
	/**
	 * 变换状态
	 */
	readonly transformState: ITransformState;
	/**
	 * 变换状态是否被改变
	 */
	readonly hasTransformChanged: boolean;

	/**
	 * 更新根元素实时尺寸（内部使用）
	 */
	updateRootSize(width: number, height: number): void;

	/**
	 * 更新视频容器元素实时尺寸（内部使用）
	 */
	updateWrapperSize(size: AspectRatio): void;

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
