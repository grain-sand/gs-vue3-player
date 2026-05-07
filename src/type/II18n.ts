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
    /** 跟随视频比例 */
    aspectRatioAuto: string;
    /** 变换控制 */
    transform: string;
    /** 允许拖动 */
    draggable: string;
    /** 左右镜像 */
    flipHorizontal: string;
    /** 上下镜像 */
    flipVertical: string;
    /** 旋转 */
    rotate: string;
    /** 适应尺寸 */
    scaleFit: string;
    /** 2倍缩放 */
    scale2x: string;
    /** 1.5倍缩放 */
    scale15x: string;
    /** 原始尺寸 */
    scaleAuto: string;
    /** 打开链接 */
    openLink: string;
    /** 下载 */
    download: string;
    /** 信息面板 */
    info: string;
  };
  /** 播放列表标题 */
  playlist: string;
  /** 移除按钮标题 */
  remove: string;
}
