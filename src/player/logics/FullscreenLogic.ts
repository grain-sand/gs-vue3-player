import {IGsWidgetProps} from "../../type";

export function fullscreenLogic() {
  let container: HTMLElement | null = null;

  const handleFullscreenChange = () => {
    const isFullscreen = document.fullscreenElement !== null;
    
    if (isFullscreen && container) {
      container.style.width = '100%';
      container.style.height = '100%';
    }
  };

  return {
    mount({cxt}: IGsWidgetProps): void {
      container = cxt.container;
      document.addEventListener('fullscreenchange', handleFullscreenChange);
    },
    unmount(): void {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      container = null;
    }
  };
}
