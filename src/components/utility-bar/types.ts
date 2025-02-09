import type { TidySectionBase } from "src/types/types";

export interface UtilityToolbarCommandParams<TContext> {
  id: string;
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
  sections: TidySectionBase[];
}

export interface UtilityItemFilterParams {
  filterName: string;
  setName: string;
  text: string;
}
