import {ContextMenuItem, ContextMenuItemDefaultNames, IGsWidget} from '../../../type';
import GsInfoMenuItem from './GsInfoMenuItem.vue';
import GsListMenuItem from './GsListMenuItem.vue';
import GsHelpMenuItem from './GsHelpMenuItem.vue';
import GsClearMenuItem from './GsClearMenuItem.vue';

export const defaultMenuComponents: Record<string, IGsWidget> = {
  'info': GsInfoMenuItem,
  'list': GsListMenuItem,
  'help': GsHelpMenuItem,
  'clear': GsClearMenuItem
};

export function resolveContextMenuComponent(item: ContextMenuItem): IGsWidget | null {
  if (typeof item === 'string') {
    return defaultMenuComponents[item] || null;
  }
  return item;
}

export function resolveContextMenuItems(
  defaultNames: readonly string[] = ContextMenuItemDefaultNames,
  items?: ContextMenuItem[],
  insertItems?: { position?: number; item: ContextMenuItem }[]
): ContextMenuItem[] {
  if (items) {
    return items;
  }

  const resolved = [...defaultNames];

  if (insertItems) {
    for (const insert of insertItems) {
      const pos = insert.position ?? resolved.length;
      resolved.splice(pos, 0, insert.item);
    }
  }

  return resolved;
}
