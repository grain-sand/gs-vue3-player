import {IGsWidget, IGsWidgetProps} from "./IGsWidget";
import {ControlItemName, VisibilityMode} from "./GsUnionTypes";

export interface IControlBarItemProps extends IGsWidgetProps {
	visibilityMode?: VisibilityMode;
}

export type IControlBarItem = IGsWidget<IControlBarItemProps>;

export type ControlItem = ControlItemName | IControlBarItem;

export interface IAddControlItemOption {
	/**
	 * 添加位置，默认为最后
	 */
	position?: number;
	item: ControlItem;
}

export interface IControlBarOption {

	/**
	 * 进度条
	 * - `true`,默认值，显示默认进度条
	 * - `false` 不显示进度条
	 * - `IGsWidget`自定义进度条组件
	 */
	progressBar?: boolean | IGsWidget;

	/**
	 * 控制面板显示模式，默认为 `hover`
	 * - `hover` 鼠标悬停到距离底部50px时显示
	 * - `always` 一直显示
	 */
	visibilityMode?: VisibilityMode;

	/**
	 * 控制面板组件，
	 * - 默认为 `ControlDefaultItems`
	 * - 一旦设置，将完全覆盖默认值
	 */
	items?: ControlItem[];

	/**
	 * 从`items`中移除组件，默认为空，冲突时排除优先级更高
	 */
	removeItems?: ControlItemName[];

	/**
	 * 额外添加组件的，默认为空
	 */
	addItems?: IAddControlItemOption[];

}
