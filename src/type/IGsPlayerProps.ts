import {IPlayerCoreProps} from "./IPlayerCoreProps";
import {II18n} from "./II18n";
import {AspectRatioMode, I18nName, LayoutMode, VisibilityMode} from "./UnionTypes";
import {IGsLogic, IGsWidget, IGsWidgetProps} from "./IGsWidget";
import {IControlBarOption} from "./IControlBarOption";
import {IListContainerOption} from "./IListContainerOption";
import {PlaySource} from "./IPlayerSource";
import {IContextMenuOption} from "./IContextMenuOption";
import {IGsTransform} from "./IGsTransform";

export const DefaultLinkHandler = <IGsPlayerProps['linkHandler']>((url: string) => {
	window.open(url)
});

/**
 * 用于确定该元素是否需要响应键盘事件
 */
export type KeyboardTargetFn = (target: EventTarget) => boolean;

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

	/**
	 * 页面根元素
	 * - `body` 默认值
	 * - 网页全屏、右键菜单……等的挂载目标
	 */
	pageRoot?: string | HTMLElement;

	/**
	 * 响应键盘事件的元素，默认 gs-player；如果值为`null`则键盘事件无效
	 */
	keyboardTarget?: null | string | KeyboardTargetFn;

	/**
	 * 是否禁用鼠标滚轮切换上一个下一个，默认为false（不禁用）
	 */
	disableWheelNavigation?: boolean;

	/**
	 * css 变量写入目标，默认 gs-player
	 */
	variableWriteTarget?: HTMLElement;


	/**
	 * 控制面板
	 * - 未定义时，显示默认控制面板
	 * - `null` 不显示控制面板
	 * - `IGsWidget`自定义控制面板组件
	 * - `IControlBarOption` 包含默认控制面板，并对默认控制面板选项进行配置
	 */
	controlBar?: null | IGsWidget | IControlBarOption;

	/**
	 * 控制面板显示模式，默认为 `hover`
	 * - `hover` 鼠标悬停到距离底部50px时显示
	 * - `always` 一直显示
	 */
	controlVisibility?: VisibilityMode;

	/**
	 * 信息面板
	 * - 未定义时，使用默认信息面板
	 * - `null` 整体不包含信息面板组件
	 * - `IGsWidget`自定义信息面板组件
	 * - `layout=vertical`时，显示于`PlayerCore`组件下方
	 * - `layout=horizontal`时，透明显示背景，浮动于`PlayerCore`组件左下方，控制面板的上方
	 */
	infoPanel?: null | IGsWidget;

	/**
	 * 是否显示信息面板
	 * - 默认值为 `true`
	 */
	infoPanelVisible?: boolean;

	/**
	 * 列表容器
	 * - 未定义时，包含默认列表容器
	 * - `null` 整体不包含列表容器组件
	 * - `IGsWidget`自定义列表容器组件
	 * - `IListContainerOption` 包含默认列表容器，并对默认列表容器选项进行配置
	 * - `layout=vertical`时，显示于`infoPanel`组件下方
	 * - `layout=horizontal`时，背景完全透明，浮动于`PlayerCore`组件正右方，不与控制面板间产生任何覆盖
	 */
	listContainer?: null | IGsWidget | IListContainerOption;

	/**
	 * 列表容器显示模式
	 * - `always` 默认值
	 *   - `layout=vertical`时，`infoPanel`组件下方
	 *   - `layout=horizontal`时，将GsPlayer设置为 flex row 布局，列表容器位于正右方
	 * - `hover`
	 *   - `layout=vertical`时，始终隐藏
	 *   - `layout=horizontal`时，浮动于右侧，鼠标悬停右侧100px内时显示
	 */
	listVisibility?: VisibilityMode;

	/**
	 * 播放暂停时覆盖层
	 * - 未定义时，包含默认覆盖层
	 * 1. 暂停时,背景半透明
	 * 2. 静音时,背景全透明
	 * - `null` 不包含暂停时覆盖层
	 * - `IGsWidget`自定义播放暂停时覆盖层
	 */
	playOverlay?: null | IGsWidget;

	/**
	 * 无界面逻辑组件
	 * - 默认包含 css变量写入、键盘事件处理……等逻辑组件
	 * - 对其定义会覆盖默认值，如果仅是添加逻辑，应该定义`appendLogics`
	 */
	logics?: IGsLogic[];

	/**
	 * 在现有无界面逻辑组件之后，追加无界面逻辑组件
	 */
	appendLogics?: IGsLogic[];

	/**
	 * 追加内部（与 `<video>` 同级）自定义组件
	 * - 完全自定义的组件，不与任何特定位置绑定
	 * - 组件将被渲染到播放器容器内
	 */
	appendInnerWidgets?: IGsWidget | IGsWidget[] | null;

	/**
	 * 追加外部(与列表等同级)自定义组件
	 * - 完全自定义的组件，不与任何特定位置绑定
	 * - 组件将被渲染到播放器容器内
	 */
	appendOuterWidgets?: IGsWidget | IGsWidget[] | null;

	/**
	 * 链接处理函数
	 * - 默认值为 `window.open`
	 */
	linkHandler?: (url: string, src: PlaySource, props: IGsWidgetProps) => void | Promise<void>;

	/**
	 *  社交关键词处理函数
	 * - 默认值为 `undefined`，即不处理社交关键词
	 * - 当信息面板包含：#hashtag、@user等被点击时，会调用此函数，
	 * - 可以根据需要自定义处理函数
	 * @param word
	 */
	socioWordHandler?: (word: string, src: PlaySource, props: IGsWidgetProps) => void | Promise<void>

	/**
	 * 下载视频处理函数
	 * - 默认值为 `undefined`，即不处理下载
	 */
	downloadHandler?: (src: PlaySource, props: IGsWidgetProps) => void;

	/**
	 * 上下文菜单
	 * - 未定义时，显示默认上下文菜单
	 * - `null` 不显示上下文菜单
	 * - `IGsWidget`自定义上下文菜单组件
	 * - `IContextMenuOption` 包含默认上下文菜单，并对默认上下文菜单选项进行配置
	 */
	contextMenu?: null | IGsWidget | IContextMenuOption;

	defaultTransform?: Partial<IGsTransform>;

}
