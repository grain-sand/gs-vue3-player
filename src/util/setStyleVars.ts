import {isNumber} from "gs-base/types";

const KeyRegex = /([a-z])([A-Z])/g

export function setStyleVars(el: HTMLElement, props: Record<string, any>, unit: string = 'px') {
	if (!el) return;
	for (const [k, v] of Object.entries(props)) {
		if (k && v) {
			el.style.setProperty(toVarName(k), toVarValue(v, unit))
		}
	}
}

function toVarValue(v: any, unit: string) {
	if (v.value) {
		v = v.value
	}
	if (unit && isNumber(v)) {
		return `${v}${unit}`;
	}
	return v;
}


function toVarName(k: string) {
	k = k.replace(KeyRegex, (_, $1, $2) => {
		return `${$1}-${$2.toLowerCase()}`
	})
	if (k.startsWith('--')) {
		return k;
	}
	return `--${k}`;
}
