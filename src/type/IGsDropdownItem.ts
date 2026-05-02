import {DefineComponent} from 'vue';

export interface IGsDropdownItemProps {
  icon?: DefineComponent;
  text?: string;
  title?: string;
  active?: boolean;
}

export interface IGsDropdownItemEmits {
  click(event: MouseEvent): void;
}
