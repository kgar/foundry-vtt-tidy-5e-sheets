import type { TidySectionBase } from 'src/types/types';
import type { Component, ComponentProps } from 'svelte';

export type TidyTableActionArgs<
  TData extends object,
  TSection extends object = {}
> = {
  data: TData;
  section: TSection;
  rowContext: any;
};

export type TidyTableAction<
  TComponent extends Component<any>,
  TData extends object,
  TSection extends object = {}
> = {
  component: TComponent;
  props: (args: TidyTableActionArgs<TData, TSection>) => ComponentProps<TComponent>;
  condition?: (args: TidyTableActionArgs<TData, TSection>) => boolean;
};
