import type { Component, ComponentProps } from 'svelte';

export type TidyTableActionArgs<TData extends object> = {
  data: TData;
};

export type TidyTableAction<
  TComponent extends Component<any>,
  TData extends object,
> = {
  component: TComponent;
  props: (args: TidyTableActionArgs<TData>) => ComponentProps<TComponent>;
  condition?: (args: TidyTableActionArgs<TData>) => boolean;
};
