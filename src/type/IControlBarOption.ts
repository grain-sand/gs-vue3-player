import {IGsWidget} from "./IGsWidget";
import {ControlItemName} from "./UnionTypes";

export type ControlItem = ControlItemName | IGsWidget;

export interface IControlItemAppendOption {
	/**
	 * 添加位置，默认为最后
	 */
	position?: number;
	item: ControlItem;
}

export interface IControlBarOption {

	/**
	 * 进度条
	 * - 未定义时，显示默认进度条
	 * - `null` 不显示进度条
	 * - `IGsWidget`自定义进度条组件
	 */
	progressBar?: null | IGsWidget;

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
	appendItems?: IControlItemAppendOption[];

}
