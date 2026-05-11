import {AspectRatio, AspectRatioMode, LayoutMode, VisibilityMode} from "./UnionTypes";
import {IPlayerCoreExpose} from "./IPlayerCoreExpose";
import {DefineComponent} from "vue";
import {IGsPlayerProps} from "./IGsPlayerProps";
import {II18n} from "./II18n";
import {IGsTransform} from "./IGsTransform";

export interface IGsWidgetContext {

	controlVisibility: VisibilityMode;

	listVisibility: VisibilityMode;

	/** 是否显示信息面板 */
	infoPanelVisible: boolean;

	/** 是否显示帮助面板 */
	helpVisible: boolean;

	/** 是否处理播放器单击，默认为true，为静音时，为取消静音，否则为切换播放 */

	handleClick: boolean;

	/**
	 * 视频比例
	 */
	aspectRatio: AspectRatioMode

	readonly i18n: II18n;

	readonly layout: LayoutMode;

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
	 * 键盘事件注册到的元素
	 * - 默认 gs-player(需要设置可以获取焦点)
	 * - 如果值为`null`则键盘事件无效
	 */
	readonly keyboardTarget: HTMLElement | Document

	/**
	 * 视频容器元素实时尺寸（实时）
	 * - 格式：[width, height]
	 */
	readonly wrapperSize: AspectRatio

	/**
	 * 根元素尺寸（实时）
	 * - 格式：[width, height]
	 */
	readonly rootSize: AspectRatio;

	/**
	 * 上一次全屏时的根元素尺寸（实时）
	 */
	readonly previousFullscreenRect?: DOMRect;

	/**
	 * 变换状态
	 */
	readonly transform: IGsTransform;
	/**
	 * 变换状态是否被改变
	 */
	readonly transformChanged: boolean;

	/**
	 * 更新根元素实时尺寸（内部使用）
	 */
	updateRootSize(size: AspectRatio): void;

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
