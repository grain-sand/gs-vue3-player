/**
 * 播放器国际化接口
 */
export interface II18n {
  /** 错误信息 */
  errorMessage: string;
  /** 播放模式 */
  playbackModes: {
    /** 顺序播放 */
    sequence: string;
    /** 禁用 */
    disabled: string;
    /** 单个循环 */
    loop: string;
    /** 全部循环 */
    loopAll: string;
    /** 随机播放 */
    shuffle: string;
  },
  /** 按钮标题 */
  titles: {
    /** 播放/暂停 */
    play: string;
    /** 上一个 */
    pre: string;
    /** 下一个 */
    next: string;
    /** 音量 */
    volume: string;
    /** 静音 */
    mute: string;
    /** 播放速度 */
    speed: string;
    /** 全屏 */
    fullscreen: string;
    /** 网页全屏 */
    webFullscreen: string;
  };
}
