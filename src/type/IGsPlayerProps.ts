import {IPlayerCoreProps} from "./IPlayerCoreProps";
import {II18n} from "./II18n";
import {AspectRatioMode, VisibilityMode, I18nName, LayoutMode} from "./UnionTypes";
import {IGsWidget} from "./IGsWidget";
import {IControlBarOption} from "./IControlBarOption";
import {IListContainerOption} from "./IListContainerOption";

export interface IGsPlayerProps extends IPlayerCoreProps {

	/**
	 * 国际化配置
	 * - `auto` 自动根据浏览器语言选择
	 * - `zh-CN` 中文（简体）
	 * - `zh-TW` 中文（繁体）
	 * - `en` 英文
	 * - `ja` 日文
	 * - `ko` 韩文
	 */
	i18n?: I18nName | II18n;
	/**
	 * 视频比例
	 * - `16:9` 默认值
	 */
	aspectRatio?: AspectRatioMode

	/**
	 * 非全屏状态的显示布局,
	 * - `vertical` 默认值，会根据当前播放器宽度与视频比例自动调整高度
	 * - `horizontal` 会根据当前播放器高度与视频比例自动调整宽度
	 * - 全屏状态时，始终根据当前整体（包含列表与信息面板）宽高比自动选择布局模式
	 */
	layout?: LayoutMode;

	/** 是否处理播放器单击，默认为true，为静音时，为取消静音，否则为切换播放 */
	handleClick?: boolean;

	/** 是否处理播放器双击，默认为true，用于 在常规状态切换到网页全屏，在任意全屏状态都是退出全屏 */
	handleDblClick?: boolean;

	/** 可改变速度的数字数组，默认为 [0.8, 1, 1.2, 1.5, 2.0, 3.0] */
	rates?: number[];

	/** 网页全屏挂载目标，默认为body */
	webFullscreenTarget?: string | HTMLElement;

	/** 键盘事件注册到的元素，默认 gs-player(需要设置可以获取焦点)；如果值为false则键盘事件无效 */
	keyboardTarget?: HTMLElement | Document | {} | string | false;

	/**
	 * 是否禁用鼠标滚轮切换上一个下一个，默认为false（不禁用）
	 */
	disableWheelNavigation?: boolean;

	/**
	 * css 变量写入目标，默认 gs-player
	 */
	variableWriteTarget?: HTMLElement;


	controlBar?: boolean | IGsWidget | IControlBarOption;

	/**
	 * 控制面板显示模式，默认为 `hover`
	 * - `hover` 鼠标悬停到距离底部50px时显示
	 * - `always` 一直显示
	 */
	controlVisibility?: VisibilityMode;

	/**
	 * 信息面板
	 * - `true`,默认值，包含默认信息面板
	 * - `false` 整体不包含信息面板组件
	 * - `IGsWidget`自定义信息面板组件
	 * - `layout=vertical`时，显示于`PlayerCore`组件下方
	 * - `layout=horizontal`时，透明显示背景，浮动于`PlayerCore`组件右下方，控制面板的上方
	 */
	infoPanel?: boolean | IGsWidget;

	/**
	 * 列表容器
	 * - `true`,默认值，包含默认列表容器
	 * - `false` 整体不包含列表容器组件
	 * - `IGsWidget`自定义列表容器组件
	 * - `IListContainerOption` 包含默认列表容器，并对默认列表容器选项进行配置
	 * - `layout=vertical`时，显示于`infoPanel`组件下方
	 * - `layout=horizontal`时，透明显示背景，浮动于`PlayerCore`组件右下方，控制面板的上方
	 */
	listContainer?: boolean | IGsWidget | IListContainerOption;

	/**
	 * 列表容器显示模式
	 * - `always` 默认值
	 * - `hover`
	 * 1. `layout=vertical`时，始终隐藏
	 * 2. `layout=horizontal`时，浮动于右侧，鼠标悬停右侧100px内时显示
	 */
	listContainerVisibility?: VisibilityMode;


}
