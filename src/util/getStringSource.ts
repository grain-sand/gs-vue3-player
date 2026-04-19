import {PlayerSource} from "../type";

/**
 * 获取字符串类型的视频源
 * @param source
 * @param width 获取大于等于此质量的视频，如果不存在将选择最小值
 */
export function getStringSource(source: PlayerSource, width?: number): string {
	if (typeof source === 'string') {
		return source;
	}

	if (typeof source.src === 'string') {
		return source.src;
	}

	if (Array.isArray(source.src)) {
		if (source.src.length === 0) {
			return '';
		}
		const sortedSources = [...source.src].sort((a, b) => a.width - b.width);
		if (!width) {
			return sortedSources[0].url
		}

		const suitableSource = sortedSources.find(item => item.width >= width);
		if (suitableSource) {
			return suitableSource.url;
		}
		return sortedSources[sortedSources.length - 1].url;
	}
	return '';
}
