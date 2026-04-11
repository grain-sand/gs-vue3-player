import {ITypedPlayerSource, PlayerSource} from "../types";
import {isString} from "gs-base";

export function parseVideoSource(source: PlayerSource): ITypedPlayerSource<any> {
	if (isString(source)) {
		const type = getSourceTypeFromUrl(source as string);
		return {
			type,
			src: source
		};
	}
	return source as ITypedPlayerSource<any>;
}

function getSourceTypeFromUrl(url: string): string {
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
