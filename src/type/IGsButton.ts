import {DefineComponent} from 'vue';

export interface IGsButtonProps {
  icon?: DefineComponent | any;
  text?: string;
  title?: string;
  disabled?: boolean;
  hasDropdown?: boolean;
  active?: boolean;
}

export interface IGsButtonEmits {
  click(event: MouseEvent): void;
}
