import {IGsWidgetProps} from "../../type";

export function mouseEventLogic() {
  let container: HTMLElement | null = null;
  let boundClick: ((e: MouseEvent) => void) | null = null;
  let boundDblClick: ((e: MouseEvent) => void) | null = null;
  let boundWheel: ((e: WheelEvent) => void) | null = null;

  const handleClick = (props: IGsWidgetProps['props'], core: IGsWidgetProps['core']) => {
    if (!props.handleClick || !core) return;
    if (core.muted) {
      core.unmute().then(() => core.play());
    } else {
      core.togglePlay();
    }
  };

  const handleDblClick = (props: IGsWidgetProps['props'], cxt: IGsWidgetProps['cxt']) => {
    if (!props.handleDblClick) return;
    if (cxt.isFullscreen) {
      cxt.exitFullscreen();
    } else {
      cxt.webFullscreen();
    }
  };

  const handleWheel = (props: IGsWidgetProps['props'], core: IGsWidgetProps['core'], cxt: IGsWidgetProps['cxt'], e: WheelEvent) => {
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
        if(core.hasPre) {
          core.playPre();
        }
      } else {
        if(core.hasNext) {
          core.playNext();
        }
      }
    }
  };

  return {
    mount({props, cxt, core}: IGsWidgetProps): void {
      container = cxt.container;

      boundClick = handleClick.bind(null, props, core);
      boundDblClick = handleDblClick.bind(null, props, cxt);
      boundWheel = handleWheel.bind(null, props, core, cxt);

      container.addEventListener('click', boundClick);
      container.addEventListener('dblclick', boundDblClick);
      container.addEventListener('wheel', boundWheel, {passive: false});
    },
    unmount(): void {
      if (container) {
        if (boundClick) container.removeEventListener('click', boundClick);
        if (boundDblClick) container.removeEventListener('dblclick', boundDblClick);
        if (boundWheel) container.removeEventListener('wheel', boundWheel);
      }
      container = null;
      boundClick = null;
      boundDblClick = null;
      boundWheel = null;
    }
  };
}
