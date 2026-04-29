import type {ISourceWrapper, PlaySource, PlaybackMode} from "../type";
import {SourceWrapper} from "./SourceWrapper";

export interface PlaylistManagerConfig {
  onSrcChange?: (src: any) => void;
  onSrcRemove?: (src: any) => void;
}

export class PlaylistManager {
  private playlist: ISourceWrapper[] = [];
  private wrapperMap = new Map<PlaySource, ISourceWrapper>();
  private id = 0;
  private currentSrc: PlaySource | undefined;
  private config: PlaylistManagerConfig;

  constructor(config: PlaylistManagerConfig = {}) {
    this.config = config;
  }

  currentMode: PlaybackMode = 'sequence';

  updatePlaylist(list: PlaySource[]) {
    this.playlist = list.map((src) => {
      let wrapper = this.wrapperMap.get(src);
      if (!wrapper) {
        wrapper = new SourceWrapper(src as any, this.id++);
        this.wrapperMap.set(src, wrapper);
      }
      return wrapper;
    });

    if (list.length) {
      Array.from(this.wrapperMap.keys()).forEach(s => {
        if (!list.includes(s)) {
          this.wrapperMap.delete(s);
        }
      });
    } else {
      this.wrapperMap.clear();
    }
  }

  getPlaylist(): ISourceWrapper[] {
    return this.playlist;
  }

  setCurrentSrc(src: PlaySource | undefined) {
    this.currentSrc = src;
  }

  getIndex(): number {
    if (!this.playlist.length) {
      return 0;
    }
    const currentId = (this.currentSrc as ISourceWrapper)?._id;
    return this.playlist.findIndex((item) => item._id === currentId);
  }

  getNextSrc(predefinedNextSrc?: PlaySource): PlaySource | undefined {
    if (predefinedNextSrc) {
      return predefinedNextSrc;
    }
    const i = this.getIndex();
    return this.playlist[i + 1]?.src;
  }

  getPreSrc(predefinedPreSrc?: PlaySource): PlaySource | undefined {
    if (predefinedPreSrc) {
      return predefinedPreSrc;
    }
    const i = this.getIndex();
    return this.playlist[i > 0 ? i - 1 : this.playlist.length - 1]?.src;
  }

  switchToNextInPlaylist(): PlaySource | undefined {
    if (!this.playlist.length) return undefined;

    let nextIndex = this.getIndex();
    if (this.currentMode === 'shuffle') {
      do {
        nextIndex = Math.floor(Math.random() * this.playlist.length);
      } while (nextIndex === this.getIndex() && this.playlist.length > 1);
    } else {
      nextIndex = (this.getIndex() + 1) % this.playlist.length;
    }
    return this.playlist[nextIndex];
  }

  changeSource(src: undefined | number | PlaySource, pos: number = 0): PlaySource | undefined {
    let source: PlaySource | undefined;
    let wrapper: ISourceWrapper | undefined;

    if (!(src instanceof SourceWrapper) && (src || src === 0)) {
      if (typeof src === "number") {
        wrapper = this.playlist[src + pos];
        source = wrapper;
      } else if (this.wrapperMap.has(src)) {
        wrapper = this.wrapperMap.get(src);
        source = wrapper;
      } else {
        let si = (this.getIndex() + pos) % this.playlist.length;
        if (si < 0) {
          si = this.playlist.length - 1;
        }
        wrapper = new SourceWrapper(src, this.id++);
        this.playlist.splice(si, 0, wrapper);
        this.wrapperMap.set(src, wrapper);
        source = wrapper;
      }
    } else if (src instanceof SourceWrapper) {
      wrapper = src;
      source = src;
    }

    if (this.config.onSrcChange) {
      this.config.onSrcChange(wrapper || source);
    }

    return source;
  }

  navTo(src: undefined | number | PlaySource, dir: -1 | 1, predefinedPreSrc?: PlaySource, predefinedNextSrc?: PlaySource): PlaySource | undefined {
    const i = this.getIndex();
    let source: PlaySource | undefined = dir === -1 ? predefinedPreSrc : predefinedNextSrc;

    if (!source && this.playlist.length) {
      if (dir === -1) {
        source = this.playlist[i > 0 ? i - 1 : this.playlist.length - 1];
      } else {
        source = this.playlist[(i + 1) % this.playlist.length];
      }
    }

    return this.changeSource(source, -1);
  }

  handleEnded(predefinedNextSrc?: PlaySource): { action: 'play' | 'pause' | 'change', src?: PlaySource } {
    switch (this.currentMode) {
      case 'sequence':
        if (predefinedNextSrc) {
          return {action: 'change', src: predefinedNextSrc};
        } else if (this.playlist.length) {
          if (this.getIndex() < this.playlist.length - 1) {
            return {action: 'change', src: this.switchToNextInPlaylist()};
          } else {
            return {action: 'pause'};
          }
        } else {
          return {action: 'pause'};
        }
      case 'disabled':
        return {action: 'pause'};
      case 'loop':
        return {action: 'play'};
      case 'loopAll':
        return {action: 'change', src: this.switchToNextInPlaylist()};
      case 'shuffle':
        return {action: 'change', src: this.switchToNextInPlaylist()};
      case 'deleteAfterPlay':
        if (this.playlist.length) {
          const currentIndex = this.getIndex();
          if (currentIndex >= 0 && currentIndex < this.playlist.length) {
            this.removePlaylistItem(currentIndex);
            if (this.playlist.length) {
              const nextIndex = currentIndex < this.playlist.length ? currentIndex : 0;
              return {action: 'change', src: this.playlist[nextIndex]};
            } else {
              return {action: 'change', src: undefined};
            }
          }
        }
        return {action: 'change', src: undefined};
      default:
        return {action: 'pause'};
    }
  }

  removePlaylistItem(src: number | ISourceWrapper): void {
    const i = typeof src === 'number' ? src : this.playlist.findIndex((item) => item._id === src?._id);
    const delSrc = this.playlist[i];
    if (!delSrc) return;
    this.playlist.splice(i, 1);
    this.wrapperMap.delete(delSrc._raw);

    if (this.config.onSrcRemove) {
      this.config.onSrcRemove(delSrc);
    }
  }

  removeSrc(src: PlaySource | ISourceWrapper): void {
    let wrapper: ISourceWrapper | undefined;
    if (typeof src === 'object' && src !== null && '_id' in src) {
      wrapper = src;
    } else {
      wrapper = this.wrapperMap.get(src as PlaySource);
    }
    if (wrapper) {
      this.removePlaylistItem(wrapper);
    }
  }

  getWrapper(src: PlaySource): ISourceWrapper | undefined {
    return this.wrapperMap.get(src);
  }

  clear() {
    this.wrapperMap.clear();
    this.playlist = [];
    this.id = 0;
  }
}
