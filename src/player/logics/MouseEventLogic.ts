import {IGsPlayerProps, IGsWidgetContext, IGsWidgetProps, IPlayerCoreExpose} from "../../type";
import {Timer} from "gs-base/timer";

export function mouseEventLogic() {

	let props: Readonly<IGsPlayerProps>, core: IPlayerCoreExpose, cxt: IGsWidgetContext;

	const timer = new Timer(300);
	let lastClickTime = 0;

	const handleClick = async () => {
		try{
			if(Date.now() - lastClickTime < 500) return;
		} finally {
			lastClickTime = Date.now();
		}
		if (!cxt.handleClick || !core) return;
		await timer.wait();
		if (core.muted) {
			core.unmute();
		} else {
			core.togglePlay();
		}
	};

	const handleDblClick = () => {
		timer.cancel();
		if (!props.handleDblClick) return;
		if (cxt.isFullscreen) {
			cxt.exitFullscreen();
		} else {
			cxt.webFullscreen();
		}
	};

	const handleWheel = (e: WheelEvent) => {
		if (props.disableWheelNavigation || !core) return;
		e.preventDefault();

		if (e.ctrlKey || e.metaKey) {
			const currentScale = cxt.transformState.scaleMode;
			let newScale: number | 'fit' | 'auto' = currentScale === 'fit' || currentScale === 'auto' ? 1 : currentScale;

			if (e.deltaY < 0) {
				newScale = Math.min(newScale * 1.2, 10);
			} else {
				newScale = Math.max(newScale / 1.2, 0.2);
			}

			cxt.transformState.scaleMode = newScale;
		} else {
			if (e.deltaY < 0) {
				if (core.hasPre) {
					core.playPre();
				}
			} else {
				if (core.hasNext) {
					core.playNext();
				}
			}
		}
	};

	return {
		mount(p: IGsWidgetProps): void {
			({props, core, cxt} = p);
			const {container} = cxt;

			container.addEventListener('click', handleClick);
			container.addEventListener('dblclick', handleDblClick);
			container.addEventListener('wheel', handleWheel, {passive: false});
		},
		unmount({cxt: {container}}): void {
			container.removeEventListener('click', handleClick);
			container.removeEventListener('dblclick', handleDblClick);
			container.removeEventListener('wheel', handleWheel, {passive: false});
			props = core = cxt = null;
		}
	};
}
