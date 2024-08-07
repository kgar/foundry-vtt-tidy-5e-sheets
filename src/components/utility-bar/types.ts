export interface UtilityToolbarCommandParams<TContext> {
  title?: string;
  text?: string;
  iconClass?: string;
  context?: any;
  execute?: (detail: UtilityToolbarCommandExecuteEvent<TContext>) => void;
  disabled?: boolean;
  visible?: boolean;
}

export interface UtilityToolbarCommandExecuteEvent<TContext = any> {
  event: Event;
  context: TContext;
}

export interface UtilityItemFilterParams {
  filterName: string;
  setName: string;
  text: string;
}
