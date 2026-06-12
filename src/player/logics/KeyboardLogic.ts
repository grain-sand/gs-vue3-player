import {IGsWidgetProps, KeyboardTargetFn} from "../../type";

export function keyboardLogic() {
	let isTarget: KeyboardTargetFn = null;
	let boundHandler: ((e: KeyboardEvent) => void) | null = null;

	const handleKeydown = (core: IGsWidgetProps['core'], cxt: IGsWidgetProps['cxt'], e: KeyboardEvent) => {
		if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement).getAttribute?.('contenteditable') || !isTarget(e.target, cxt)) {
			return;
		}
		switch (e.code) {
			case 'Space':
				e.preventDefault();
				core.togglePlay();
				break;
			case 'ArrowLeft':
				e.preventDefault();
				core.time -= e.ctrlKey ? 15 : 5
				break;
			case 'ArrowRight':
				e.preventDefault();
				core.time += e.ctrlKey ? 15 : 5
				break;
			case 'ArrowUp':
				e.preventDefault();
				if (core.hasPre) {
					core.playPre();
				}
				break;
			case 'ArrowDown':
				e.preventDefault();
				if (core.hasNext) {
					core.playNext();
				}
				break;
			case 'Home':
				e.preventDefault();
				if (core.playlist[0]) {
					core.play(core.playlist[0]);
				}
				break;
			case 'End':
				e.preventDefault();
				const last = core.playlist[core.playlist.length - 1];
				if (last) {
					core.play(last);
				}
				break;
			case 'KeyM':
				e.preventDefault();
				core.muted = !core.muted;
				break;
			case 'KeyF':
				e.preventDefault();
				if (cxt.isFullscreen) {
					cxt.exitFullscreen();
				} else {
					cxt.fullscreen();
				}
				break;
			case 'Enter':
				e.preventDefault();
				if (cxt.isFullscreen) {
					cxt.exitFullscreen();
				} else {
					cxt.webFullscreen();
				}
				break;
			case 'KeyV':
				e.preventDefault();
				core.togglePip();
				break;
			case 'F1':
				e.preventDefault();
				if (cxt.helpVisible !== undefined) {
					cxt.helpVisible = !cxt.helpVisible;
				}
				break;
		}
	};

	return {
		mount({cxt, core}: IGsWidgetProps): void {
			const {keyboardTarget: selector} = cxt;
			isTarget = selector instanceof Function ? selector : ((target) => cxt.isFullscreen || (target as HTMLElement)?.matches?.(selector as string));
			boundHandler = handleKeydown.bind(null, core, cxt);
			document.addEventListener('keydown', boundHandler);
		},
		unmount(): void {
			if (boundHandler) {
				document.removeEventListener('keydown', boundHandler);
			}
			boundHandler = null;
			isTarget = null;
		}
	};
}
