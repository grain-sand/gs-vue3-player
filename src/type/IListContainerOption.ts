import {ListHeaderVisible, ListTabHeaderPartName, PlaylistItemPartName} from "./UnionTypes";
import {IGsWidget, IGsWidgetProps} from "./IGsWidget";
import {ISourceWrapper} from "./IPlayerSource";

export interface IPlaylistItemProps extends IGsWidgetProps {
	current: ISourceWrapper
	index: number
}

export type IPlaylistItemPart = IGsWidget<IPlaylistItemProps>

export type PlaylistItemPart = PlaylistItemPartName | IPlaylistItemPart;

export interface IListTabHeaderPartProps extends IGsWidgetProps {
	tab: IListContainerAppendTab
	/**
	 * 当前Tab是否激活
	 */
	active: boolean;
	/**
	 * 设置当前Tab为激活状态
	 */
	setActive: () => void;
}

export type IListTabHeaderPart = IGsWidget<IListTabHeaderPartProps>

export type ListTabHeaderPart = ListTabHeaderPartName | IListTabHeaderPart;

export interface IListContainerTab {
	title: string;
	/**
	 * 列表项内容
	 * - `IGsWidget` 自定义组件
	 * - `PlaylistItemPart[]` 为数组时,将使用默认播放列表，其定义的项将作为列表项部件，添加在列表项主体的下方
	 */
	body: object & IGsWidget | PlaylistItemPart[];

	/**
	 * 列表项标题
	 * - `IListTabHeaderPart` 自定义组件
	 * - `ListTabHeaderPart[]` 为数组时,将使用默认列表项标题部件，其定义的项将作为列表项标题部件，添加在列表项标题的下方
	 * - 默认值为 `['title']`
	 */
	header?: object & IListTabHeaderPart | ListTabHeaderPart[];

}

export interface IListContainerAppendTab extends IListContainerTab {
	position?: number;
}

export interface IListContainerOption {

	/**
	 * 列表容器标题是否可见
	 * - `auto` 默认值, 当`layout=horizontal`时 或 有2项以上列表  显示
	 * - `visible` 始终显示
	 * - `hidden` 始终隐藏
	 */
	headerVisible?: ListHeaderVisible;

	tabs?: IListContainerTab[];

	appendTabs?: IListContainerAppendTab[];

}
