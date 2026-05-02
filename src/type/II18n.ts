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
    /** 播放后删除 */
    deleteAfterPlay: string;
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
    /** 退出全屏 */
    exitFullscreen: string;
    /** 网页全屏 */
    webFullscreen: string;
    /** 弹出小窗 */
    pip: string;
    /** 退出弹出小窗 */
    exitPip: string;
    /** 显示列表 */
    showList: string;
    /** 隐藏列表 */
    hideList: string;
  };
  /** 播放列表标题 */
  playlist?: string;
  /** 移除按钮标题 */
  remove?: string;
}
