export type IMeasureResult = {
	lines: number
	scrollHeight: number
	scrollWidth: number
	width: number
	height: number
}

export interface IMeasureRenderedTextArg {
	text: string,
	className?: string,
	style?: Partial<CSSStyleDeclaration>
}

const hiddenMeasureEl = (() => {
	const el = document.createElement('div')

	Object.assign(el.style, {
		position: 'absolute',
		pointerEvents: 'none',
		// left: '100px',
		// top: '100px',
		left: '-9999px',
		top: '-9999px',
		zIndex: '-999999',
	})

	document.body.appendChild(el)

	return el
})()

export function measureRenderedText(arg: IMeasureRenderedTextArg): IMeasureResult {
	const {text, className = '', style = {}} = arg;
	const el = hiddenMeasureEl
	el.className = className;
	style && Object.assign(el.style, style)

	el.innerHTML = text

	let lineHeight = parseFloat(getComputedStyle(el).lineHeight)

	return {
		lines: Math.max(1, Math.round(el.scrollHeight / lineHeight)),
		scrollHeight: el.scrollHeight,
		scrollWidth: el.scrollWidth,
		width: el.clientWidth,
		height: el.clientHeight,
	}
}
