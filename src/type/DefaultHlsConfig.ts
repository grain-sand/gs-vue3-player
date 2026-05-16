import {HlsConfig} from "hls.js";

export const DefaultHlsConfig: Partial<HlsConfig> = Object.freeze({
	maxBufferLength: 3,
	maxStarvationDelay: 3,
	maxMaxBufferLength: 5,
	lowLatencyMode: false,      // 关闭低延迟（低延迟会多预载）
	capLevelToPlayerSize: true, // 限制视频质量（根据播放器大小调整）
	autoStartLoad: true,
	maxLoadingDelay: 0.1,
	minBufferLength: 1,
	startLevel: -1,
	enableWorker: true,
	maxBufferSize: 30 * 1024 * 1024, // 30MB, 缓冲区字节上限（默认60MB，限制最大内存）
	// backBufferLength: 20, // 只保留播放过的20s，自动释放旧分片
})
