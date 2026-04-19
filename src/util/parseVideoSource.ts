import {
	IQualitiesSource,
	IStringSource,
	ITypedSource,
	PlayerSource,
	PlayerSourceType
} from "../type";
import {isString} from "gs-base/types";

export function parseVideoSource(source: PlayerSource): ITypedSource {
	if (isString(source)) {
		const type = getSourceTypeFromUrl(source as string);
		return {
			type,
			src: source
		};
	}
	const typedSourc = source as IStringSource & IQualitiesSource;
	if (!typedSourc.type) {
		if (Array.isArray(typedSourc.src)) {
			typedSourc.type = getSourceTypeFromUrl(typedSourc.src[0]?.url)
		} else if (Array.isArray(typedSourc.src)) {
			typedSourc.type = getSourceTypeFromUrl(typedSourc.src as string);
		}
	}
	return typedSourc;
}

function getSourceTypeFromUrl(url: string): PlayerSourceType {
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
