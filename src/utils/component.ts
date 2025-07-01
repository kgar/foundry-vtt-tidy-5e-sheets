import type { Component, ComponentProps } from 'svelte';

export type ConditionalComponentWithProps<TComponent extends Component<any>> =
  ComponentWithProps<TComponent> & {
    condition: (doc: any) => boolean;
  };

export type ComponentWithProps<TComponent extends Component<any>> = {
  component: TComponent;
  props: ComponentProps<TComponent>;
};

export function componentWithProps<TComponent extends Component<any>>(
  component: TComponent,
  props: ComponentProps<TComponent>
): ComponentWithProps<TComponent> {
  return {
    component: component,
    props: props,
  };
}
