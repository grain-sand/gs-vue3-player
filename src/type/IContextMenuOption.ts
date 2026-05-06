import {IGsWidget} from "./IGsWidget";

export type ContextMenuItem = IContextMenuOption | IGsWidget

export interface IInsertContextMenuItem {
	position?: number;
	item: ContextMenuItem;
}

export interface IContextMenuOption {
	/**
	 * 菜单项的标签
	 * - 在父菜单中显示的标签，如果没有父菜单，将不显示
	 * - 可以是 i18n路径，例如 'player.play' 表示播放按钮
	 * - 当 i18n不存在时，将使用原始字符串
	 */
	label?: string;

	/**
	 * 子菜单项
	 * - 设置此项将会覆盖默认值
	 */
	items?: ContextMenuItem[];

	/**
	 * 在已有的 `items` 中插入菜单项
	 */
	insertItems?: IInsertContextMenuItem[];
}
