import type { CustomTabTitle, OnRenderParams, RenderScheme } from 'src/api';
import type { HandlebarsTemplateRenderer } from 'src/api/HandlebarsTemplateRenderer';
import type { Item5e } from 'src/types/item';
import type {
  HtmlRuntimeContent,
  HtmlTabContent,
  OnRenderTabParams,
  SvelteTabContent,
} from 'src/types/types';

export type RegisteredContent<TContext> = {
  activateDefaultSheetListeners?: boolean;
  content: SvelteTabContent | HtmlRuntimeContent | HandlebarsTemplateRenderer;
  enabled?: (context: TContext) => boolean;
  getData?: (data: any) => any | Promise<any>;
  layout?: SheetLayout | SheetLayout[];
  onRender?: (args: OnRenderParams) => void;
  position: string;
  renderScheme?: RenderScheme;
  selector: string;
}

export type RegisteredTab<TContext> = {
  enabled?: (context: TContext) => boolean;
  layout?: SheetLayout | SheetLayout[];
  title: CustomTabTitle;
  id: string;
  content: SvelteTabContent | HtmlTabContent | HandlebarsTemplateRenderer;
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
  label: string;
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
