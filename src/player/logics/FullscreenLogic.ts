import {IGsWidgetProps} from "../../type";

export function fullscreenLogic() {
  let playerRoot: HTMLElement | null = null;

  const handleFullscreenChange = () => {
    const isFullscreen = document.fullscreenElement !== null;

    if (isFullscreen && playerRoot) {
      playerRoot.style.width = '100%';
      playerRoot.style.height = '100%';
    }
  };

  return {
    mount({cxt}: IGsWidgetProps): void {
      playerRoot = cxt.playerRoot;
      document.addEventListener('fullscreenchange', handleFullscreenChange);
    },
    unmount(): void {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      playerRoot = null;
    }
  };
}
