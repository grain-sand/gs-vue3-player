import {PlaySource} from "./IPlayerSource";
import {IGsWidgetProps} from "./IGsWidget";

export interface ILinkHandlerContext {
	src: PlaySource
	props: IGsWidgetProps
	event: MouseEvent | PointerEvent | TouchEvent
	el?: HTMLElement
}

export type LinkHandler = (url: string, cxt: ILinkHandlerContext) => void | Promise<void>;

export type SocioWordHandler = (word: string, cxt: ILinkHandlerContext) => void | Promise<void>;
