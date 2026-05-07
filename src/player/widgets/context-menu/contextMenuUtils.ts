import {DefineComponent} from 'vue';
import {II18n} from '../../../type';
import {InfoSvg, ListSvg, HelpSvg} from '../../../svgs';

const iconMap: Record<string, DefineComponent> = {
  'info': InfoSvg as any,
  'list': ListSvg as any,
  'help': HelpSvg as any
};

const labelPathMap: Record<string, string> = {
  'info': 'titles.info',
  'list': 'titles.showList',
  'help': 'titles.help'
};

export function getContextMenuItemIcon(item: string): DefineComponent {
  return iconMap[item] || (InfoSvg as unknown as DefineComponent);
}

export function getContextMenuItemLabel(item: string, i18n: II18n): string {
  const path = labelPathMap[item];
  if (!path) return item;

  const parts = path.split('.');
  let value: any = i18n;
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return item;
    }
  }

  return typeof value === 'string' ? value : item;
}
