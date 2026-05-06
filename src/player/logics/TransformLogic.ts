import type { IGsLogic, IGsWidgetProps } from '../../type';
import { watch } from 'vue';

export class TransformLogic implements IGsLogic {
  private props: IGsWidgetProps | null = null;
  private isDragging = false;
  private startPos = { x: 0, y: 0 };
  private startTranslate = { x: 0, y: 0 };
  private cleanup: (() => void) | null = null;

  mount(props: IGsWidgetProps): void {
    this.props = props;
    this.registerEvents();
    this.setupWatcher();
  }

  unmount(): void {
    this.unregisterEvents();
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = null;
    }
    this.props = null;
  }

  private registerEvents(): void {
    const { core } = this.props!;
    const el = core.el;

    el.addEventListener('mousedown', this.onMouseDown);
    el.addEventListener('touchstart', this.onTouchStart);
    el.addEventListener('touchmove', this.onTouchMove);
    el.addEventListener('touchend', this.onTouchEnd);
  }

  private unregisterEvents(): void {
    if (!this.props) return;
    const { core } = this.props;
    const el = core.el;

    el.removeEventListener('mousedown', this.onMouseDown);
    el.removeEventListener('touchstart', this.onTouchStart);
    el.removeEventListener('touchmove', this.onTouchMove);
    el.removeEventListener('touchend', this.onTouchEnd);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mouseleave', this.onMouseLeave);
  }

  private setupWatcher(): void {
    const { cxt } = this.props!;

    this.cleanup = watch(
      () => cxt.transformState,
      () => this.updateTransformStyle(),
      { deep: true }
    );
  }

  private updateTransformStyle(): void {
    if (!this.props) return;
    const { core, cxt } = this.props;

    const state = cxt.transformState;
    const transforms: string[] = [];
    const containerW = cxt.containerWidth;
    const containerH = cxt.containerHeight;

    transforms.push('scale(1)');
    if (state.scaleMode === 'fit') {
      const [videoWidth, videoHeight] = core.size;

      if (videoWidth > 0 && videoHeight > 0 && containerW > 0 && containerH > 0) {
        const videoRatio = videoWidth / videoHeight;
        const containerRatio = containerW / containerH;

        if (videoRatio > containerRatio) {
          core.style.width = '100%';
          core.style.height = 'auto';
        } else {
          core.style.width = 'auto';
          core.style.height = '100%';
        }
      } else {
        core.style.width = 'auto';
        core.style.height = 'auto';
      }
    } else if (typeof state.scaleMode === 'number') {
      core.style.width = 'auto';
      core.style.height = 'auto';
      transforms.push(`scale(${state.scaleMode})`);
    } else {
      core.style.width = 'auto';
      core.style.height = 'auto';
      transforms.push('scale(1)');
    }

    if (state.flipHorizontal) {
      transforms.push('scaleX(-1)');
    }

    if (state.flipVertical) {
      transforms.push('scaleY(-1)');
    }

    if (state.rotation !== 0) {
      transforms.push(`rotate(${state.rotation}deg)`);
    }

    if (state.translateX !== 0 || state.translateY !== 0) {
      transforms.push(`translate(${state.translateX}px, ${state.translateY}px)`);
    }

    core.style.transform = transforms.join(' ');
  }

  private onMouseDown = (e: MouseEvent) => {
    this.isDragging = true;
    this.startPos = { x: e.clientX, y: e.clientY };
    const state = this.props!.cxt.transformState;
    this.startTranslate = { x: state.translateX, y: state.translateY };

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mouseleave', this.onMouseLeave);
    e.preventDefault();
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isDragging || !this.props) return;

    const dx = e.clientX - this.startPos.x;
    const dy = e.clientY - this.startPos.y;

    const state = this.props.cxt.transformState;
    state.translateX = this.startTranslate.x + dx;
    state.translateY = this.startTranslate.y + dy;
  };

  private onMouseUp = () => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mouseleave', this.onMouseLeave);
  };

  private onMouseLeave = () => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mouseleave', this.onMouseLeave);
  };

  private onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 0) return;
    this.isDragging = true;
    const touch = e.touches[0];
    this.startPos = { x: touch.clientX, y: touch.clientY };
    const state = this.props!.cxt.transformState;
    this.startTranslate = { x: state.translateX, y: state.translateY };
    e.preventDefault();
  };

  private onTouchMove = (e: TouchEvent) => {
    if (!this.isDragging || !this.props || e.touches.length === 0) return;

    const touch = e.touches[0];
    const dx = touch.clientX - this.startPos.x;
    const dy = touch.clientY - this.startPos.y;

    const state = this.props.cxt.transformState;
    state.translateX = this.startTranslate.x + dx;
    state.translateY = this.startTranslate.y + dy;
    e.preventDefault();
  };

  private onTouchEnd = () => {
    this.isDragging = false;
  };
}
