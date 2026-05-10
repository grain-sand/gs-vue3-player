import {IGsWidgetProps} from "../../type";

export function keyboardLogic() {
	let target: HTMLElement | Document | null = null;
	let boundHandler: ((e: KeyboardEvent) => void) | null = null;

	const handleKeydown = (core: IGsWidgetProps['core'], cxt: IGsWidgetProps['cxt'], e: KeyboardEvent) => {
		if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement).getAttribute?.('contenteditable')) {
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
				core.volume = Math.min(1, core.volume + 0.1);
				break;
			case 'ArrowDown':
				e.preventDefault();
				core.volume = Math.max(0, core.volume - 0.1);
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
			case 'KeyN':
				e.preventDefault();
				core.playNext();
				break;
			case 'KeyP':
				e.preventDefault();
				core.playPre();
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
			const {keyboardTarget} = cxt;
			if ((target = keyboardTarget)) {
				boundHandler = handleKeydown.bind(null, core, cxt);
				target.addEventListener('keydown', boundHandler);
				if ('setAttribute' in target) {
					target.setAttribute('tabindex', '0');
				}
			}
		},
		unmount(): void {
			if (target && boundHandler) {
				target.removeEventListener('keydown', boundHandler);
			}
			target = null;
			boundHandler = null;
		}
	};
}
