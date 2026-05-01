import {defineComponent, h, type Component, type ComponentPublicInstance} from 'vue';

type ExtractComponentProps<T> = T extends new () => ComponentPublicInstance<infer P>
  ? P
  : T extends { props?: infer P }
    ? P
    : Record<string, unknown>;

export function wrapComponent<T extends Component>(
  component: T,
  props: Partial<ExtractComponentProps<T>>
): Component {
  return defineComponent(() => {
    return () => h(component, props);
  });
}
