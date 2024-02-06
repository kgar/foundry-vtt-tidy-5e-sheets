export interface UtilityBarCommandParams {
  title?: string;
  text?: string;
  iconClass?: string;
  context?: any;
  execute?: (detail: UtilityBarCommandExecuteEvent) => void;
  disabled?: boolean;
  visible?: boolean;
}

export interface UtilityBarCommandExecuteEvent {
  event: Event;
}
