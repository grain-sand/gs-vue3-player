import {IGsPlayerProps, IGsWidget} from '../../type';
import {isVueComponent} from '../../util';
import {GsControlBar, GsContextMenu, GsHelpPanel, GsInfoPanel, GsListContainer, GsPlayOverlay} from './index';

export interface IWidgetResolverResult {
	controlBar: IGsWidget | null;
	overlay: IGsWidget | null;
	infoPanel: IGsWidget | null;
	helpPanel: IGsWidget;
	listContainer: IGsWidget | null;
	contextMenu: IGsWidget | null;
	innerWidgets: IGsWidget[];
	outerWidgets: IGsWidget[];
}

export function resolveWidgets(props: IGsPlayerProps): IWidgetResolverResult {
	const controlBar = resolveControlBar(props);
	const overlay = resolveOverlay(props);
	const infoPanel = resolveInfoPanel(props);
	const helpPanel = resolveHelpPanel();
	const listContainer = resolveListContainer(props);
	const contextMenu = resolveContextMenu(props);
	const innerWidgets = resolveInnerWidgets(props, overlay);
	const outerWidgets = resolveOuterWidgets(props, infoPanel, helpPanel, listContainer, contextMenu);

	return {
		controlBar,
		overlay,
		infoPanel,
		helpPanel,
		listContainer,
		contextMenu,
		innerWidgets,
		outerWidgets
	};
}

function resolveControlBar(props: IGsPlayerProps): IGsWidget | null {
	if (props.controlBar === null) return null;
	if (isVueComponent(props.controlBar)) {
		return props.controlBar;
	}
	return GsControlBar;
}

function resolveOverlay(props: IGsPlayerProps): IGsWidget | null {
	if (props.playOverlay === null) return null;
	if (isVueComponent(props.playOverlay)) {
		return props.playOverlay;
	}
	return GsPlayOverlay;
}

function resolveInfoPanel(props: IGsPlayerProps): IGsWidget | null {
	if (props.infoPanel === null) return null;
	if (isVueComponent(props.infoPanel)) {
		return props.infoPanel;
	}
	return GsInfoPanel;
}

function resolveHelpPanel(): IGsWidget {
	return GsHelpPanel;
}

function resolveListContainer(props: IGsPlayerProps): IGsWidget | null {
	if (props.listContainer === null) return null;
	if (isVueComponent(props.listContainer)) {
		return props.listContainer;
	}
	return GsListContainer;
}

function resolveContextMenu(props: IGsPlayerProps): IGsWidget | null {
	if (props.contextMenu === null) return null;
	if (isVueComponent(props.contextMenu)) {
		return props.contextMenu;
	}
	return GsContextMenu;
}

function resolveInnerWidgets(props: IGsPlayerProps, overlay: IGsWidget | null): IGsWidget[] {
	const iws = props.appendInnerWidgets;
	const widgets: IGsWidget[] = iws ? Array.isArray(iws) ? [...iws] : [iws] : [];
	if (overlay) widgets.push(overlay);
	return widgets;
}

function resolveOuterWidgets(
	props: IGsPlayerProps,
	infoPanel: IGsWidget | null,
	helpPanel: IGsWidget,
	listContainer: IGsWidget | null
	, contextMenu: IGsWidget): IGsWidget[] {
	const ows = props.appendOuterWidgets;
	const widgets: IGsWidget[] = ows ? Array.isArray(ows) ? [...ows] : [ows] : [];
	if (infoPanel) widgets.push(infoPanel);
	if (helpPanel) widgets.push(helpPanel);
	if (listContainer) widgets.push(listContainer);
	if (contextMenu) widgets.push(contextMenu);
	return widgets;
}
