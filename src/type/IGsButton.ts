import {DefineComponent} from 'vue';

export interface IGsButtonProps {
  icon?: DefineComponent | any;
  text?: string;
  title?: string;
  disabled?: boolean;
  hasDropdown?: boolean;
  active?: boolean;
  class?: string | object;
}

export interface IGsButtonEmits {
  click(event: MouseEvent): void;
  mouseenter(event: MouseEvent): void;
  mouseleave(event: MouseEvent): void;
}
