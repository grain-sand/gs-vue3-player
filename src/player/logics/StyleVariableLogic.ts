import {AspectRatio, IGsWidgetContext, IGsWidgetProps, IPlayerCoreExpose} from "../../type";
import {setStyleVars} from "../../util";
import {Timer} from "gs-base/timer";
import {watch} from "vue";

export function styleVariableLogic() {
	let stopAspectRatioWatch: Function;
	let stopVideoSizeWatch: Function;
	let target: HTMLElement | null = null;
	let resizeObserver: ResizeObserver | null = null;
	const timer = new Timer(300);
	let core: IPlayerCoreExpose;
	let cxt: IGsWidgetContext;
	let containerSize: AspectRatio;


	const calculateHeight = (): number => {
		const [width] = containerSize;
		if (!width) return 240;

		if (cxt.aspectRatio === 'auto') {
			const ratio = core.size;
			if (ratio && Array.isArray(ratio)) {
				return width * ratio[1] / ratio[0] + 2;
			} else {
				return width * 9 / 16 + 2;
			}
		} else {
			const [w = 16, h = 9] = cxt.aspectRatio;
			return width * (Number(h) / Number(w)) + 2;
		}
	};

	const handleResize = async () => {
		if (!containerSize) {
			return;
		}
		await timer.reWait();
		const [width, height] = containerSize;

		const isHorizontal = cxt.layout === 'horizontal';
		const isFullscreen = cxt.isFullscreen;
		const floating = isFullscreen && width > height;

		let playerCoreHeight: number | string;
		let playerCoreWidth: number | string;

		if (floating) {
			playerCoreHeight = height;
			playerCoreWidth = width;
		} else if (isHorizontal) {
			playerCoreHeight = height;
			const [w = 16, h = 9] = Array.isArray(cxt.aspectRatio) ? cxt.aspectRatio : [];
			playerCoreWidth = height * (Number(w) / Number(h)) + 2;
		} else {
			playerCoreHeight = calculateHeight();
			playerCoreWidth = width;
		}

		if (target) {
			setStyleVars(target, {playerCoreHeight, playerCoreWidth});
		}
	};

	return {
		mount({props, cxt: cxtProp, core: coreProp}: IGsWidgetProps): void {
			cxt = cxtProp;
			core = coreProp;
			const {variableWriteTarget} = props;

			if (variableWriteTarget instanceof HTMLElement) {
				target = variableWriteTarget;
			} else {
				target = cxt.playerRoot;
			}
			if (target) {
				resizeObserver = new ResizeObserver(async ([entry]: ResizeObserverEntry[]) => {
					const {width, height} = entry.contentRect;
					containerSize = [width, height];
					cxt.updateRootSize(width, height);
					await handleResize();
				});
				resizeObserver.observe(cxt.playerRoot);
			}

			stopAspectRatioWatch = watch(() => cxt.aspectRatio, handleResize);
			stopVideoSizeWatch = watch(() => core.size, handleResize);

		},
		unmount(): void {
			if (resizeObserver) {
				resizeObserver.disconnect();
				resizeObserver = null;
			}
			try {
				stopAspectRatioWatch?.();
			} catch {
			}
			try {

				stopVideoSizeWatch?.();
			} catch {
			}
			target = null;
		}
	};
}
