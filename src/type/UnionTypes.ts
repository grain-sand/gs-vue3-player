export const PlaySourceTypes = ['hls', 'mp4', 'webm', 'ogg'] as const;

export type PlaySourceType = (typeof PlaySourceTypes)[number];

/** 播放模式 */
export const PlaybackModes = ['sequence', 'disabled', 'loop', 'loopAll', 'shuffle', 'deleteAfterPlay'] as const;

/** 播放模式类型 */
export type PlaybackMode = (typeof PlaybackModes)[number];

export const DefaultPlaybackMode: PlaybackMode = PlaybackModes[0];

/**
 * 视频宽高比
 * - 格式：[width, height]
 */
export type AspectRatio = [number, number];

export type AspectRatioMode = AspectRatio | 'auto';

export const DefaultAspectRatios: AspectRatio[] = [[16, 9], [4, 3], [9, 16], [3, 4]];

export const DefaultAspectRatio: AspectRatio = DefaultAspectRatios[0];

export const LayoutModes = ['vertical', 'horizontal'] as const;

export type LayoutMode = (typeof LayoutModes)[number];

export const DefaultLayoutMode: LayoutMode = LayoutModes[0];

export const ControlVisibilityModes = ['hover', 'always'] as const;

export type VisibilityMode = (typeof ControlVisibilityModes)[number];

export const DefaultControlVisibility: VisibilityMode = ControlVisibilityModes[0];

export const DefaultListContainerVisibility: VisibilityMode = ControlVisibilityModes[1];

export const ControlDefaultItems = [
	/**
	 * 播放/暂停按钮
	 */
	'play',
	/**
	 * 切换下一个输入源按钮
	 */
	'next',
	/**
	 * 时间信息
	 */
	'time',
	/**
	 * 空白填充组件
	 * - 会自动伸展占用所有剩余空间，没有padding与margin
	 */
	'-',
	/**
	 * 播放速度菜单切换按钮
	 * - 悬停时出现切换菜单
	 * - 悬停时响应鼠标中键滚动调整播放速度
	 */
	'speed',
	/**
	 * 音量切换菜单按钮
	 * - 悬停时出现音量调整菜单
	 * - 悬停时响应鼠标中键滚动调整音量
	 */
	'volume',
	/**
	 * 播放模式切换按钮
	 */
	'mode',
	/**
	 * 变换控制菜单
	 */
	'transform',
	/**
	 * 比例切换菜单按钮
	 */
	'aspect-ratio',
	/**
	 * 全屏菜单
	 * - 按钮为 web全屏切换
	 * - 菜单中包含 pip 与 fullscreen 按钮
	 */
	'fullscreen-menu'
] as const;

export const ControlItemNames = [...ControlDefaultItems,
	/**
	 * 切换上一个输入源按钮
	 */
	'pre',
	/**
	 * 切换列表显示模式
	 * - `layout=horizontal` 时，自动隐藏此按钮
	 */
	'list',
	/**
	 * 浏览器原生弹出视频小窗模式
	 */
	'pip',
	/**
	 * 原生全屏
	 */
	'fullscreen',
	/**
	 * 网页全屏
	 */
	'webFullscreen',
] as const;

export type ControlItemName = (typeof ControlItemNames)[number];

export const I18nNames = ['auto', 'zh-CN', 'zh-TW', 'en', 'ja', 'ko'] as const;

export type I18nName = (typeof I18nNames)[number];

export const DefaultI18nName: I18nName = I18nNames[0];

export const DefaultRates: number[] = [0.8, 1, 1.2, 1.5, 2.0, 3.0]

export const ListHeaderVisibles = ['auto', 'visible', 'hidden'] as const

export type ListHeaderVisible = (typeof ListHeaderVisibles)[number];

export const DefaultListHeaderVisible: ListHeaderVisible = ListHeaderVisibles[0];

export const PlaylistItemPartNames = [
	/**
	 * 作者 组件
	 */
	'author',
	/**
	 * 创建时间组件
	 */
	'date',
	/**
	 * 空白填充组件
	 * - 会自动伸展占用所有剩余空间，没有padding与margin
	 */
	'-',
	/**
	 * 时间信息组件
	 */
	'time',
	/**
	 * 移除按钮组件
	 */
	'remove'
] as const;

export type PlaylistItemPartName = (typeof PlaylistItemPartNames)[number];

export const ContextMenuItemDefaultNames = [
	/** 切换 信息面板 的 显示/隐藏 */
	'info',
	/** 切换 列表 的 显示/隐藏 */
	'list',
	/**
	 * 分隔线
	 */
	'|',
	// /** 模式切换->二级菜单 */
	// ControlDefaultItems[7],
	// /** 变换->二级菜单 */
	// ControlDefaultItems[8],
	// /** 切换显示比例->二级菜单 */
	// ControlDefaultItems[9],
	'clear',
	'|',
	/**
	 * 帮助
	 * - 弹出帮助面板
	 * - 帮助面板中主要包含快捷键说明
	 * - 帮助面板显示于 `<teleport :to="pageRoot">` 内
	 */
	'help'
] as const;

export const ContextMenuItemNames = [
	...ContextMenuItemDefaultNames,
] as const;

export type ContextMenuItemName = (typeof ContextMenuItemNames)[number];

export const AuthorTypes = ['none', 'blue', 'government','business','vip','svip','supper'] as const;

export type AuthorType = (typeof AuthorTypes)[number];
