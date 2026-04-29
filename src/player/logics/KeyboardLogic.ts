import {IGsLogic, IGsWidgetProps} from "../../type";

export class KeyboardLogic implements IGsLogic {

  private keyboardEventTarget: EventTarget | null = null;
  private context: IGsWidgetProps['cxt'] | null = null;

  mount({core, props, cxt}: IGsWidgetProps): void {
    this.context = cxt;
    const {keyboardTarget: keyTar} = props;
    if (keyTar === false) return;

    let target: EventTarget | null;

    if (typeof keyTar === 'string') {
      target = document.querySelector(keyTar);
      if (!target && keyTar === '.gs-player') {
        target = cxt.container;
      }
    } else if (keyTar instanceof HTMLElement || keyTar instanceof Document) {
      target = keyTar;
    } else {
      target = cxt.container;
    }

    if (target) {
      if (target instanceof HTMLElement && !target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '0');
      }
      target.addEventListener('keydown', this.handleKeydown.bind(this, core), true);
      this.keyboardEventTarget = target;
    }
  }

  private handleKeydown(core: IGsWidgetProps['core'], e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (e.key) {
      case 'ArrowLeft':
        if (core) {
          const step = e.ctrlKey ? 15 : 5;
          core.time = Math.max(0, core.time - step);
        }
        break;
      case 'ArrowRight':
        if (core) {
          const step = e.ctrlKey ? 15 : 5;
          core.time = Math.min(core.duration, core.time + step);
        }
        break;
      case 'ArrowUp':
        core?.playPre();
        break;
      case 'ArrowDown':
        core?.playNext();
        break;
      case ' ':
        e.preventDefault();
        core?.togglePlay();
        break;
      case 'Escape':
      case 'Enter':
        if (this.context) {
          if (this.context.isFullscreen) {
            this.context.exitFullscreen();
          } else {
            this.context.webFullscreen();
          }
        }
        break;
    }
  }

  unmount(): void {
    if (this.keyboardEventTarget) {
      this.keyboardEventTarget.removeEventListener('keydown', this.handleKeydown.bind(this), true);
      this.keyboardEventTarget = null;
    }
  }
}
