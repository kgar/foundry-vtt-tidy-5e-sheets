import type { RenderScheme } from 'src/api';
import type { HandlebarsTemplateContent } from 'src/api/HandlebarsTemplateContent';
import { CONSTANTS } from 'src/constants';
import type {
  HtmlTabContent,
  OnRenderTabArgs,
  SvelteTabContent,
} from 'src/types/types';

export type RegisteredActorTab<TContext> = {
  enabled?: (context: TContext) => boolean;
  layout?: SheetLayout | SheetLayout[];
  title: string;
  id: string;
  content: SvelteTabContent | HtmlTabContent | HandlebarsTemplateContent;
  onRender?: (args: OnRenderTabArgs) => void;
  renderScheme?: RenderScheme;
  tabContentsClasses?: string[];
};

/**
 * One of the supported layouts of Tidy 5e sheets.
 */
export type SheetLayout =
  | typeof CONSTANTS.SHEET_LAYOUT_ALL
  | typeof CONSTANTS.SHEET_LAYOUT_CLASSIC; // More to come ;)
