import type {
  CustomContentInjectParams,
  CustomTabTitle,
  OnContentReadyParams,
  OnRenderParams,
  RenderScheme,
} from 'src/api';
import type { HandlebarsTemplateRenderer } from 'src/runtime/HandlebarsTemplateRenderer';
import type { Item5e } from 'src/types/item';
import type {
  HtmlRuntimeContent,
  Actor5e,
  HtmlTabContent,
  OnRenderTabParams,
  SvelteTabContent,
  ActorSheetContext,
} from 'src/types/types';

export type RegisteredContent<TContext> = {
  activateDefaultSheetListeners?: boolean;
  content: SvelteTabContent | HtmlRuntimeContent | HandlebarsTemplateRenderer;
  enabled?: (context: TContext) => boolean;
  getData?: (data: any) => any | Promise<any>;
  injectParams?: CustomContentInjectParams;
  layout?: SheetLayout | SheetLayout[];
  onContentReady?: (params: OnContentReadyParams) => void;
  onRender?: (args: OnRenderParams) => void;
  renderScheme?: RenderScheme;
};

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
  autoHeight?: boolean;
};

/**
 * One of the supported layouts of Tidy 5e sheets.
 */
/** @category Shared */
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

export type RegisteredPortraitMenuCommand = {
  label?: string;
  iconClass?: string;
  tooltip?: string;
  enabled?: (params: RegisteredPortraitMenuCommandEnabledParams) => boolean;
  execute?: (params: RegisteredPortraitMenuCommandExecuteParams) => void;
};

export type RegisteredPortraitMenuCommandEnabledParams = {
  actor: Actor5e;
};
export type RegisteredPortraitMenuCommandExecuteParams = {
  actor: Actor5e;
  context: ActorSheetContext;
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

export type RegisteredCustomActorTrait = {
  title: string;
  alwaysShow?: boolean;
  openConfiguration?: (params: RegisteredTraitOpenConfigurationParams) => void;
  openConfigurationTooltip?: string;
  enabled?: (params: RegisteredTraitEnabledParams) => boolean;
  iconClass?: string;
};
export type RegisteredTraitEnabledParams = {
  context: any;
};
export type RegisteredTraitOpenConfigurationParams = {
  app: any;
  element: HTMLElement;
  data: any;
  event: Event;
};

