import type { CustomTabTitle, RenderScheme } from 'src/api';
import type { HandlebarsTemplateContent } from 'src/api/HandlebarsTemplateContent';
import type { Item5e } from 'src/types/item';
import type {
  Actor5e,
  HtmlTabContent,
  OnRenderTabParams,
  SvelteTabContent,
} from 'src/types/types';

export type RegisteredTab<TContext> = {
  enabled?: (context: TContext) => boolean;
  layout?: SheetLayout | SheetLayout[];
  title: CustomTabTitle;
  id: string;
  content: SvelteTabContent | HtmlTabContent | HandlebarsTemplateContent;
  onRender?: (args: OnRenderTabParams) => void;
  renderScheme?: RenderScheme;
  tabContentsClasses?: string[];
  getData?: (data: any) => any | Promise<any>;
  activateDefaultSheetListeners?: boolean;
};

/**
 * One of the supported layouts of Tidy 5e sheets.
 */
export type SheetLayout = 'all' | 'classic';

export type RegisteredItemSummaryCommand = {
  label?: string;
  iconClass?: string;
  tooltip?: string;
  enabled?: (params: RegisteredItemSummaryCommandEnabledParams) => boolean;
  execute?: (params: RegisteredItemSummaryCommandExecuteParams) => void;
};

export type RegisteredItemSummaryCommandEnabledParams = {
  item: Item5e;
};
export type RegisteredItemSummaryCommandExecuteParams = {
  item: Item5e;
};

export type RegisteredActorItemSectionFooterCommand = {
  label?: string;
  iconClass?: string;
  tooltip?: string;
  enabled?: (
    params: RegisteredActorItemSectionFooterCommandEnabledParams
  ) => boolean;
  execute?: (
    params: RegisteredActorItemSectionFooterCommandExecuteParams
  ) => void;
};

export type RegisteredActorItemSectionFooterCommandEnabledParams = {
  actor: Actor5e;
  section: any;
};
export type RegisteredActorItemSectionFooterCommandExecuteParams = {
  actor: Actor5e;
  section: any;
  event: Event;
};
