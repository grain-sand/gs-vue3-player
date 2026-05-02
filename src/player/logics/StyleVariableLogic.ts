import {IGsWidgetProps} from "../../type";
import {setStyleVars} from "../../util";
import {AspectRatioMode, DefaultAspectRatio} from "../../type";
import {Timer} from "gs-base/timer";

export function styleVariableLogic() {
	let target: HTMLElement | null = null;
	let resizeObserver: ResizeObserver | null = null;
	const timer = new Timer(300);
	let rect: DOMRectReadOnly = {} as DOMRectReadOnly;
	let aspectRatio: AspectRatioMode = DefaultAspectRatio;

	const calculateHeight = (core: IGsWidgetProps['core']): number => {
		const {width} = rect;
		if (!width) return 240;

		if (aspectRatio === 'auto') {
			const src = core.src as any;
			const ratio = src?.aspectRatio;
			if (ratio && Array.isArray(ratio)) {
				return width * ratio[1] / ratio[0] + 2;
			} else {
				return width * 9 / 16 + 2;
			}
		} else {
			const [w = 16, h = 9] = aspectRatio;
			return width * (Number(h) / Number(w)) + 2;
		}
	};

	const handleResize = async (cxt: IGsWidgetProps['cxt'], core: IGsWidgetProps['core'], [entry]: ResizeObserverEntry[]) => {
		if (entry.contentRect) {
			rect = entry.contentRect;
		}
		cxt.updateContainerSize(rect.width, rect.height);
		await timer.reWait();

		const isHorizontal = cxt.layout === 'horizontal';
		const isFullscreen = cxt.isFullscreen;
		const floating = isFullscreen && rect.width > rect.height;

		let playerCoreHeight: number | string;
		let playerCoreWidth: number | string;

		if (floating) {
			playerCoreHeight = rect.height;
			playerCoreWidth = rect.width;
		} else if (isHorizontal) {
			playerCoreHeight = rect.height;
			const [w = 16, h = 9] = Array.isArray(aspectRatio) ? aspectRatio : [];
			playerCoreWidth = rect.height * (Number(w) / Number(h)) + 2;
		} else {
			playerCoreHeight = calculateHeight(core);
			playerCoreWidth = rect.width;
		}

		if (target) {
			setStyleVars(target, {playerCoreHeight, playerCoreWidth});
		}
	};

	return {
		mount({props, cxt, core}: IGsWidgetProps): void {
			const {variableWriteTarget} = props;

			if (variableWriteTarget instanceof HTMLElement) {
				target = variableWriteTarget;
			} else {
				target = cxt.container;
			}

			aspectRatio = props.aspectRatio || DefaultAspectRatio;

			if (target) {
				resizeObserver = new ResizeObserver(handleResize.bind(null, cxt, core));
				resizeObserver.observe(cxt.container);
			}
		},
		unmount(): void {
			if (resizeObserver) {
				resizeObserver.disconnect();
				resizeObserver = null;
			}
			target = null;
		}
	};
}
