import {
	IQualitiesSource,
	IStringSource,
	ITypedSource,
	PlaySource,
	PlaySourceType
} from "../type";
import {isString} from "gs-base/types";

export function parseVideoSource(source: PlaySource): ITypedSource {
	if (isString(source)) {
		const type = getSourceTypeFromUrl(source as string);
		return {
			type,
			src: source
		};
	}
	const typedSrc = source as IStringSource & IQualitiesSource;
	if (!typedSrc.type) {
		if (Array.isArray(typedSrc.src)) {
			typedSrc.type = getSourceTypeFromUrl(typedSrc.src[0]?.url)
		} else if (Array.isArray(typedSrc.src)) {
			typedSrc.type = getSourceTypeFromUrl(typedSrc.src as string);
		}
	}
	return typedSrc;
}

function getSourceTypeFromUrl(url: string): PlaySourceType {
	const lowerUrl = url.toLowerCase();
	if (lowerUrl.includes('.m3u8') || lowerUrl.includes('hls')) {
		return 'hls';
	} else if (lowerUrl.includes('.mp4')) {
		return 'mp4';
	} else if (lowerUrl.includes('.webm')) {
		return 'webm';
	} else if (lowerUrl.includes('.ogg')) {
		return 'ogg';
	}
	return 'mp4';
}
