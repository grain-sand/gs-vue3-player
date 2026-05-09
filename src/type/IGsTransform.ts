export interface IGsTransform {
	draggable: boolean;
	flipHorizontal: boolean;
	flipVertical: boolean;
	rotation: number;
	scaleMode: 'fit' | 'auto' | number;
	translateX: number;
	translateY: number;
}

export const DefaultTransform: Readonly<IGsTransform> = Object.freeze({
	draggable: false,
	flipHorizontal: false,
	flipVertical: false,
	rotation: 0,
	scaleMode: 'auto',
	translateX: 0,
	translateY: 0
});
