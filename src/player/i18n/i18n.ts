import {II18n} from '../../type';
import {zhCN, zhTW, enUS, jaJP, koKR} from './index';
import type {I18nName} from '../../type';

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
