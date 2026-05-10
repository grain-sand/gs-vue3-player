import {IGsWidgetContext, IGsWidgetProps, IPlayerCoreExpose} from "../../type";
import {watch} from "vue";
import {wait} from "gs-base/timer";

export function fullscreenLogic() {

	let core: IPlayerCoreExpose, cxt: IGsWidgetContext, stopScreenWatch: Function,
		stopSizeWatch: Function;

	const onFullscreenChange = async (isFullscreen: boolean) => {
		const {playerRoot: root} = cxt;

		if (isFullscreen && root) {
			root.style.width = '100%';
			root.style.height = '100%';
		}

		// 处理质量调整
		if (isFullscreen) {
			await wait(10)
			const [width, height] = cxt.rootSize;
			core.toBestQuality({width, height});
			(cxt.keyboardTarget as HTMLElement).focus?.();
		} else {
			core.autoQualityHls?.();
		}
	};

	const onSizeChange = ([width, height]) => {
		if (cxt.isFullscreen) core.toBestQuality({width, height})
	}

	return {
		mount(p: IGsWidgetProps): void {
			({core, cxt} = p);
			stopScreenWatch = watch(() => cxt.isFullscreen, onFullscreenChange);
			stopSizeWatch = watch(() => cxt.rootSize, onSizeChange);
		},
		unmount(): void {
			stopScreenWatch?.();
			stopSizeWatch?.();
			core = cxt = stopScreenWatch = stopSizeWatch = null;
		}
	};
}
