import type { CustomTabTitle, RenderScheme } from 'src/api';
import type { HandlebarsTemplateContent } from 'src/api/HandlebarsTemplateContent';
import type { Item5e } from 'src/types/item';
import type {
  HtmlTabContent,
  OnRenderTabArgs,
  SvelteTabContent,
} from 'src/types/types';

export type RegisteredTab<TContext> = {
  enabled?: (context: TContext) => boolean;
  layout?: SheetLayout | SheetLayout[];
  title: CustomTabTitle;
  id: string;
  content: SvelteTabContent | HtmlTabContent | HandlebarsTemplateContent;
  onRender?: (args: OnRenderTabArgs) => void;
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
  enabled?: (params: RegisteredItemSummaryCommandEnabledParams) => boolean;
  execute?: (item: Item5e) => void;
};

export type RegisteredItemSummaryCommandEnabledParams = {
  item: Item5e;
};
