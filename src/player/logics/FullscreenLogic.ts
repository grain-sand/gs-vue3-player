import {IGsLogic, IGsWidgetProps} from "../../type";

export class FullscreenLogic implements IGsLogic {

  private container: HTMLElement | null = null;
  private fullscreenChangeHandler: () => void = () => {};

  mount({cxt}: IGsWidgetProps): void {
    this.container = cxt.container;
    this.fullscreenChangeHandler = this.handleFullscreenChange.bind(this);
    
    document.addEventListener('fullscreenchange', this.fullscreenChangeHandler);
  }

  private handleFullscreenChange(): void {
    const isFullscreen = document.fullscreenElement !== null;
    
    if (isFullscreen && this.container) {
      this.container.style.width = '100%';
      this.container.style.height = '100%';
    }
  }

  unmount(): void {
    document.removeEventListener('fullscreenchange', this.fullscreenChangeHandler);
    this.container = null;
  }
}
