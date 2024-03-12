export interface UtilityToolbarCommandParams {
  title?: string;
  text?: string;
  iconClass?: string;
  context?: any;
  execute?: (detail: UtilityToolbarCommandExecuteEvent) => void;
  disabled?: boolean;
  visible?: boolean;
}

export interface UtilityToolbarCommandExecuteEvent {
  event: Event;
}

export interface UtilityItemFilterParams {
  filterName: string;
  setName: string;
  text: string;
}
