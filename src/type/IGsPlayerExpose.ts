import {IPlayerCoreExpose} from "./IPlayerCoreExpose";
import {IGsWidgetContext} from "./IGsWidget";
import {IPlayerCoreMediaEmits} from "./IPlayerCoreEmits";
import {PlaySource} from "./IPlayerSource";


export interface IGsPlayerExpose<Data = any, Source extends PlaySource<Data> = PlaySource<Data>> extends Omit<IGsWidgetContext, 'updateRootSize' | 'updateWrapperSize' | 'updatePageUrl'> {

	readonly core: IPlayerCoreExpose<Data, Source>;

}

export interface IGsPlayerEmits extends IPlayerCoreMediaEmits {
}
