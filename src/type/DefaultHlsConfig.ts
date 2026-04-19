import {HlsConfig} from "hls.js";

export const DefaultHlsConfig: Partial<HlsConfig> = Object.freeze({
	maxBufferLength: 1,        // 几乎不缓冲未来
	maxMaxBufferLength: 2,
	maxBufferBackLength: 0,    // 不保留已播内容
	lowLatencyMode: false,      // 关闭低延迟（低延迟会多预载）
	capLevelToPlayerSize: true, // 限制视频质量（根据播放器大小调整）
	autoStartLoad: true,
	maxLoadingDelay: 0.1,
	minBufferLength: 1,
	startLevel: -1,
})
