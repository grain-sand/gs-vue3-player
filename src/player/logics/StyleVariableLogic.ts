import {IGsLogic, IGsWidgetProps} from "../../type";
import {setStyleVars} from "../../util";
import {AspectRatioMode, DefaultAspectRatio} from "../../type";
import {Timer} from "gs-base/timer";

export class StyleVariableLogic implements IGsLogic {

  private target: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private timer: Timer = new Timer(300);
  private rect: DOMRectReadOnly = {} as DOMRectReadOnly;
  private aspectRatio: AspectRatioMode = DefaultAspectRatio;

  mount({props, cxt, core}: IGsWidgetProps): void {
    const {variableWriteTarget} = props;
    
    if (variableWriteTarget instanceof HTMLElement) {
      this.target = variableWriteTarget;
    } else {
      this.target = cxt.container;
    }

    this.aspectRatio = props.aspectRatio || DefaultAspectRatio;

    if (this.target) {
      this.resizeObserver = new ResizeObserver(this.handleResize.bind(this, cxt, core));
      this.resizeObserver.observe(cxt.container);
    }
  }

  private async handleResize(cxt: IGsWidgetProps['cxt'], core: IGsWidgetProps['core'], entries: ResizeObserverEntry[]) {
    await this.timer.reWait();
    
    const entry = entries[0];
    if (entry.contentRect) {
      this.rect = entry.contentRect;
    }

    const isHorizontal = cxt.layout === 'horizontal';
    const isFullscreen = cxt.isFullscreen;
    const floating = isFullscreen && this.rect.width > this.rect.height;

    let playerCoreHeight: number | string;
    let playerCoreWidth: number | string;

    if (floating) {
      playerCoreHeight = '100%';
      playerCoreWidth = '100%';
    } else if (isHorizontal) {
      playerCoreWidth = this.rect.width;
      const [w = 16, h = 9] = Array.isArray(this.aspectRatio) ? this.aspectRatio : [];
      playerCoreHeight = this.rect.width * (Number(h) / Number(w));
    } else {
      playerCoreWidth = this.rect.width;
      playerCoreHeight = this.calculateHeight(core);
    }

    if (this.target) {
      setStyleVars(this.target, {playerCoreHeight, playerCoreWidth});
    }
  }

  private calculateHeight(core: IGsWidgetProps['core']): number {
    const {width} = this.rect;
    if (!width) return 240;
    
    if (this.aspectRatio === 'auto') {
      const src = core.src as any;
      const ratio = src?.aspectRatio;
      if (ratio && Array.isArray(ratio)) {
        return width * ratio[1] / ratio[0] + 2;
      } else {
        return width * 9 / 16 + 2;
      }
    } else {
      const [w = 16, h = 9] = this.aspectRatio;
      return width * (Number(h) / Number(w)) + 2;
    }
  }

  unmount(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.target = null;
  }
}
