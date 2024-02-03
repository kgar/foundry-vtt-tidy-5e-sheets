/** @category Configuration */
export interface CustomActorTrait {
  title: string;
  alwaysShow?: boolean;
  openConfiguration?: (params: CustomTraitOpenConfigurationParams) => void;
  openConfigurationTooltip?: string;
  enabled?: (params: CustomTraitEnabledParams) => boolean;
  iconClass?: string;
}

/** @category Configuration */
export interface CustomTraitOpenConfigurationParams {
  app: any;
  element: HTMLElement;
  data: any;
  event: Event;
}

/** @category Configuration */
export interface CustomTraitEnabledParams {
  context: any;
}
