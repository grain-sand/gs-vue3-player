import {IPlayerCoreExpose} from "./IPlayerCoreExpose";
import {IGsWidgetContext} from "./IGsWidget";
import {IPlayerCoreMediaEmits} from "./IPlayerCoreEmits";


export interface IGsPlayerExpose extends Omit<IGsWidgetContext, 'updateContainerSize'> {

	readonly core: IPlayerCoreExpose;

}

export interface IGsPlayerEmits extends IPlayerCoreMediaEmits {
}
