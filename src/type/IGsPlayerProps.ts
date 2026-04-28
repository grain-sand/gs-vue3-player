import {IPlayerCoreProps} from "./IPlayerCoreProps";
import {II18n} from "./II18n";
import {AspectRatioMode, LayoutMode} from "./GsUnionTypes";
import {IGsWidget} from "./IGsWidget";
import {IControlBarOption} from "./IControlBarOption";

export interface IGsPlayerProps extends IPlayerCoreProps {

	/** 网页全屏挂载目标，默认为body */
	webFullscreenTarget?: string | HTMLElement;

	/** 国际化配置 */
	i18n?: II18n;

	/** 键盘事件注册到的元素，默认 gs-player(需要设置可以获取焦点)；如果值为false则键盘事件无效 */
	keyboardTarget?: HTMLElement | Document | {} | string | false;

	/**
	 * 视频比例
	 */
	aspectRatio?: AspectRatioMode

	/**
	 * 是否禁用鼠标滚轮切换上一个下一个，默认为false（不禁用）
	 */
	disableWheelNavigation?: boolean;

	/**
	 * css 变量写入目标，默认 gs-player
	 */
	variableWriteTarget?: HTMLElement;

	/**
	 * 显示布局
	 * - 默认 `auto`
	 */
	layout?: LayoutMode;

	/**
	 * 进度条
	 * - `true`,默认值，显示默认进度条
	 * - `false` 不显示进度条
	 * - `IGsWidget`自定义进度条组件
	 */
	progressBar?: boolean | IGsWidget;

	/**
	 * 信息面板
	 * - `true`,默认值，显示默认信息面板
	 * - `false` 不显示信息面板
	 * - `IGsWidget`自定义信息面板组件
	 */
	infoPanel?: boolean | IGsWidget;

	controlBar?: boolean | IGsWidget | IControlBarOption;


}
