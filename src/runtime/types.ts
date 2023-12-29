import type { CustomTabTitle, RenderScheme } from 'src/api';
import type { HandlebarsTemplateRenderer } from 'src/api/HandlebarsTemplateRenderer';
import type { HtmlContent } from 'src/api/content/HtmlContent';
import type { Item5e } from 'src/types/item';
import type {
  HtmlTabContent,
  OnRenderTabParams,
  SvelteTabContent,
} from 'src/types/types';

export type RegisteredContent<TContext> = {
  selector: string;
  position: string;
  enabled?: (context: TContext) => boolean;
  layout?: SheetLayout | SheetLayout[];
  // TODO: Cut a separate internal HtmlContent type
  content: SvelteTabContent | HtmlContent | HandlebarsTemplateRenderer;
  renderScheme?: RenderScheme;
  activateDefaultSheetListeners?: boolean;
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
