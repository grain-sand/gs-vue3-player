export type AspectRatio = [number, number];

export type AspectRatioMode = AspectRatio | 'auto';

export const DefaultAspectRatios: AspectRatio[] = [[16, 9], [4, 3], [9, 16], [3, 4]];

export const DefaultAspectRatio: AspectRatio = DefaultAspectRatios[0];

export const LayoutModes = ['auto', 'horizontal', 'vertical'] as const;

export type LayoutMode = (typeof LayoutModes)[number];

export const DefaultLayoutMode: LayoutMode = LayoutModes[0];
