import {IGsWidgetContext, IGsWidgetProps, IPlayerCoreExpose} from "../../type";
import {watch} from "vue";

export function fullscreenLogic() {

	let core: IPlayerCoreExpose, cxt: IGsWidgetContext, stopWatch: Function;

	const onFullscreenChange = (isFullscreen: boolean) => {
		const {playerRoot: root} = cxt;

		if (isFullscreen && root) {
			root.style.width = '100%';
			root.style.height = '100%';
		}

		// 处理质量调整
		if (isFullscreen) {
			core.toBestQuality({
				width: cxt?.rootSize[0] ?? 0,
				height: cxt?.rootSize[1] ?? 0,
			});
		} else {
			core.autoQualityHls?.();
		}
	};

	return {
		mount(p: IGsWidgetProps): void {
			({core, cxt} = p);
			stopWatch = watch(() => cxt.isFullscreen, onFullscreenChange);
		},
		unmount(): void {
			stopWatch?.();
			core = cxt = stopWatch = null;
		}
	};
}
