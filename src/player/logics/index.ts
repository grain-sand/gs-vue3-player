import {IGsLogic, IGsPlayerProps, IGsWidgetProps} from '../../type';
import {styleVariableLogic} from "./StyleVariableLogic";
import {keyboardLogic} from "./KeyboardLogic";
import {fullscreenLogic} from "./FullscreenLogic";
import {mouseEventLogic} from "./MouseEventLogic";
import {TransformLogic} from "./TransformLogic";

export const defaultLogics: IGsLogic[] = [
	styleVariableLogic(),
	keyboardLogic(),
	fullscreenLogic(),
	new TransformLogic(),
	mouseEventLogic()
];

export class LogicManager {

	private static logics: IGsLogic[] = [];

	static async mount(widgetProps: IGsWidgetProps): Promise<void> {
		const mergedLogics = LogicManager.getMergedLogics(widgetProps.props);
		for (const logic of mergedLogics) {
			await logic.mount(widgetProps);
		}
	}

	static unmount(widgetProps: IGsWidgetProps): void {
		for (const logic of this.logics) {
			if (logic.unmount) {
				logic.unmount(widgetProps);
			}
		}
	}

	private static getMergedLogics(props: IGsPlayerProps) {
		const baseLogics = props.logics ?? defaultLogics;
		return (this.logics = [...baseLogics, ...(props.appendLogics || [])]);
	}
}
