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
		/** 画中画 */
		pip: string;
		/** 退出画中画 */
		exitPip: string;
		/** 显示列表 */
		showList: string;
		/** 隐藏列表 */
		hideList: string;
		/** 随视频比例 */
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
		/** 下载 */
		download: string;
		/** 信息面板 */
		info: string;
		/** 帮助 */
		help: string;
		/** 清空播放列表 */
		clearPlaylist: string;
		/** 快进快退 */
		seek: string;
		/** 快退10秒 */
		seekBackward: string;
		/** 快进10秒 */
		seekForward: string;
		/** 鼠标操作 */
		mouse: string;
		/** 单击 */
		click: string;
		/** 双击 */
		doubleClick: string;
		/** 滚轮 */
		wheel: string;
		/** 滚轮切换 */
		wheelSwitch: string;
		/** 滚轮缩放 */
		wheelScale: string;
	};
	/** 播放列表标题 */
	playlist: string;
	/** 移除按钮标题 */
	remove: string;
	/** 相对时间格式化 */
	date: IDateI18n;
}

/**
 * 相对时间格式化接口
 */
export interface IDateI18n {
	/** 天 */
	day: string;
	/** 小时 */
	hour: string;
	/** 分钟 */
	minute: string;
	/** 前 */
	ago: string;
}
