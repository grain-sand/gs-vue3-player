import {IPlayerCoreExpose} from "./IPlayerCoreExpose";
import {IGsWidgetContext} from "./IGsWidget";
import {IPlayerCoreEmits} from "./IPlayerCoreEmits";


export interface IGsPlayerExpose extends IGsWidgetContext {

	readonly core: IPlayerCoreExpose;

}

export interface IGsPlayerEmits extends IPlayerCoreEmits {
}
