import {AspectRatioMode, LayoutMode} from "./UnionTypes";
import {IPlayerCoreExpose} from "./IPlayerCoreExpose";
import {DefineComponent} from "vue";
import {IGsPlayerProps} from "./IGsPlayerProps";
import {II18n} from "./II18n";


export interface IGsWidgetContext extends Pick<IGsPlayerProps, 'layout' | 'controlVisibility'> {

	/**
	 * 视频比例
	 */
	readonly aspectRatio: AspectRatioMode

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
