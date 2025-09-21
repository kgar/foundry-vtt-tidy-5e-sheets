import type { TidySectionBase } from 'src/types/types';
import type { Component, ComponentProps } from 'svelte';

// TODO: Rework these types so that 
// - there is a headerCondition and headerProps that don't have rowContext
// - data is arbitrary and not necessary a document from the outside's perspective
// - rowContext is reevaluated carefully to determine if it can just be another variant of TData

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
