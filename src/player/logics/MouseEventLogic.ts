import {IGsPlayerProps, IGsWidgetContext, IGsWidgetProps, IPlayerCoreExpose} from "../../type";
import {Timer} from "gs-base/timer";

export function mouseEventLogic() {

	let props: Readonly<IGsPlayerProps>, core: IPlayerCoreExpose, cxt: IGsWidgetContext;

	const timer = new Timer(300);
	let lastClickTime = 0, lastWheelTime = 0;

	const handleClick = async () => {
		try {
			if (Date.now() - lastClickTime < 500) return;
		} finally {
			lastClickTime = Date.now();
		}
		if (!core) return;
		const lastTime = core.time;
		await timer.wait();
		if (!cxt.handleClick) return;
		core.time = lastTime;
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
		} else if (props.dbClickHandler === 'web-fullscreen') {
			cxt.webFullscreen();
		} else if (props.dbClickHandler === 'fullscreen') {
			cxt.fullscreen();
		}
	};

	const handleWheel = (e: WheelEvent) => {
		if (props.disableWheelNavigation || !core) return;
		e.preventDefault();

		if (e.ctrlKey || e.metaKey) {
			const currentScale = cxt.transform.scaleMode;
			let newScale: number | 'fit' | 'auto' = currentScale === 'fit' || currentScale === 'auto' ? 1 : currentScale;

			if (e.deltaY < 0) {
				newScale = Math.min(newScale * 1.2, 10);
			} else {
				newScale = Math.max(newScale / 1.2, 0.2);
			}

			cxt.transform.scaleMode = newScale;
		} else {
			const now = Date.now();
			if (now - lastWheelTime < 500) return;
			lastWheelTime = now;
			if (e.deltaY < -2) {
				if (core.hasPre) {
					core.playPre();
				}
			} else if (e.deltaY > 2) {
				if (core.hasNext) {
					core.playNext();
				}
			}
		}
	};

	return {
		mount(p: IGsWidgetProps): void {
			({props, core, cxt} = p);
			const {playerRoot} = cxt;
			playerRoot.addEventListener('click', handleClick);
			playerRoot.addEventListener('dblclick', handleDblClick);
			playerRoot.addEventListener('wheel', handleWheel, {passive: false});
		},
		unmount({cxt: {playerRoot}}): void {
			playerRoot.removeEventListener('click', handleClick);
			playerRoot.removeEventListener('dblclick', handleDblClick);
			playerRoot.removeEventListener('wheel', handleWheel, {passive: false});
			props = core = cxt = null;
		}
	};
}
