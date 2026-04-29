export type AspectRatio = [number, number];

export type AspectRatioMode = AspectRatio | 'auto';

export const DefaultAspectRatios: AspectRatio[] = [[16, 9], [4, 3], [9, 16], [3, 4]];

export const DefaultAspectRatio: AspectRatio = DefaultAspectRatios[0];

export const LayoutModes = ['auto', 'horizontal', 'vertical'] as const;

export type LayoutMode = (typeof LayoutModes)[number];

export const DefaultLayoutMode: LayoutMode = LayoutModes[0];

export const VisibilityModes = ['hover', 'always'] as const;

export type VisibilityMode = (typeof VisibilityModes)[number];

export const DefaultVisibilityMode: VisibilityMode = VisibilityModes[0];

export const ControlDefaultItems = [
	/**
	 * 播放/暂停按钮
	 */
	'play',
	/**
	 * 切换上一个输入源按钮
	 */
	'pre',
	/**
	 * 切换下一个输入源按钮
	 */
	'next',
	/**
	 * 时间信息
	 */
	'time',
	/**
	 * 空白填充
	 * - 会自动伸展占用所有剩余空间，没有padding与margin
	 */
	'-',
	/**
	 * 播放速度切换按钮
	 * - 悬停时出现切换菜单
	 * - 悬停时响应鼠标中键滚动调整播放速度
	 */
	'speed',
	/**
	 * 音量切换按钮
	 * - 悬停时出现音量调整菜单
	 * - 悬停时响应鼠标中键滚动调整音量
	 */
	'volume',
	/**
	 * 切换列表显示模式
	 * - `layout=horizontal` 时，自动隐藏此按钮
	 */
	'list',
	/**
	 * 全屏菜单
	 * - 按钮为 web全屏切换
	 * - 菜单中包含 pip 与 fullscreen 按钮
	 */
	'fullscreen-menu'
] as const;

export const ControlItemNames = [...ControlDefaultItems, 'pip', 'fullscreen', 'webFullscreen'] as const;

export type ControlItemName = (typeof ControlItemNames)[number];
