import {II18n} from '../../type';
import type {I18nName} from '../../type';
import {zhCN} from "./zhCN";
import {zhTW} from "./zhTW";
import {enUS} from "./enUS";
import {jaJP} from "./jaJP";
import {koKR} from "./koKR";

const i18nMap: Partial<Record<I18nName, II18n>> = {
	'zh-CN': zhCN,
	'zh-TW': zhTW,
	'en': enUS,
	'ja': jaJP,
	'ko': koKR
};

export function getI18nConfig(i18n: II18n | I18nName): II18n {
	if (typeof i18n === 'string') {
		const lang = i18n === 'auto' ?
			(navigator.language as I18nName) || 'zh-CN' :
			i18n;
		return i18nMap[lang] || zhCN;
	}
	return i18n;
}
