import type { CustomTabTitle, RenderScheme } from 'src/api';
import type { HandlebarsTemplateContent } from 'src/api/HandlebarsTemplateContent';
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
