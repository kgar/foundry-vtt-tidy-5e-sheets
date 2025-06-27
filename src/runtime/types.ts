import type {
  CustomContentInjectParams,
  OnContentReadyParams,
  OnRenderParams,
  RenderScheme,
} from 'src/api/api.types';
import type { CustomTabTitle } from 'src/api/tab/CustomTabBase';
import type { CONSTANTS } from 'src/constants';
import type { HandlebarsTemplateRenderer } from 'src/runtime/HandlebarsTemplateRenderer';
import type { Item5e } from 'src/types/item.types';
import type {
  HtmlRuntimeContent,
  Actor5e,
  HtmlTabContent,
  OnRenderTabParams,
  SvelteTabContent,
  ActorSheetContextV1,
  ActorSheetClassicContextV2,
  TidySectionBase,
} from 'src/types/types';
import type { Component } from 'svelte';
import type { TidyTableAction } from 'src/components/table-quadrone/table-buttons/table.types';

export type RegisteredContent<TContext> = {
  activateDefaultSheetListeners?: boolean;
  content: SvelteTabContent | HtmlRuntimeContent | HandlebarsTemplateRenderer;
  enabled?: (context: TContext) => boolean;
  getData?: (data: any) => any | Promise<any>;
  injectParams?: CustomContentInjectParams;
  layout: SheetLayout;
  onContentReady?: (params: OnContentReadyParams) => void;
  onRender?: (args: OnRenderParams) => void;
  renderScheme?: RenderScheme;
};

export type RegisteredTab<TContext> = {
  enabled?: (context: TContext) => boolean;
  layout: SheetLayout;
  title: CustomTabTitle;
  iconClass?: string;
  id: string;
  content: SvelteTabContent | HtmlTabContent | HandlebarsTemplateRenderer;
  onRender?: (args: OnRenderTabParams) => void;
  renderScheme?: RenderScheme;
  tabContentsClasses?: string[];
  getData?: (data: any) => any | Promise<any>;
  activateDefaultSheetListeners?: boolean;
  autoHeight?: boolean;
  itemCount?: (context: any) => number;
  types?: Set<string>;
};

/**
 * One of the supported layouts of Tidy 5e sheets.
 */
/** @category Shared */
export type SheetLayout =
  | typeof CONSTANTS.SHEET_LAYOUT_ALL
  | typeof CONSTANTS.SHEET_LAYOUT_CLASSIC
  | typeof CONSTANTS.SHEET_LAYOUT_QUADRONE;

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
  event: PointerEvent | MouseEvent;
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
  context: ActorSheetContextV1 | ActorSheetClassicContextV2;
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

export type ContainerContentsRowActionsContext = {
  unlocked: boolean;
  hasActor: boolean;
};

export type ColumnSpecificationCalculatedWidthArgs = {
  rowActions: TidyTableAction<any, any, any>[];
};

// Columns
export type ColumnSpecification = {
  headerContent?:
    | {
        type: 'component';
        component: Component<ColumnHeaderProps>;
      }
    | {
        type: 'callback';
        callback: (sheetDocument: any, sheetContext: any) => string;
      }
    | {
        type: 'html';
        html: string;
      };
  cellContent:
    | {
        type: 'component';
        component: Component<ColumnCellProps>;
      }
    | {
        type: 'callback';
        callback: (rowDocument: any, rowContext: any) => string;
      };
  widthRems:
    | number
    | ((section: ColumnSpecificationCalculatedWidthArgs) => number); // default: 5 (rem)
  priority: number;
  order: number;
  headerClasses?: string;
  cellClasses?: string;
  condition?: <TSection extends TidySectionBase>(
    data: ColumnSpecificationConditionArgs<any, TSection>
  ) => boolean;
};

/** Column specification whose optionally calculable width has been calculated and which has a key for uniquely identifying it. */
export type ConfiguredColumnSpecification = ColumnSpecification & {
  key: string;
  widthRems: number;
};

export type ColumnHeaderProps<
  TDocument = any,
  TContext = any,
  TSection = TidySectionBase
> = {
  sheetDocument: TDocument;
  sheetContext: TContext;
  section: TSection;
};

export type ColumnCellProps<
  TDocument = any,
  TContext = any,
  TSection = TidySectionBase
> = {
  rowDocument: TDocument;
  rowContext: TContext;
  section: TSection;
};

export type ColumnSpecificationConditionArgs<
  TDocument = any,
  TSection = TidySectionBase
> = {
  sheetDocument: TDocument;
  section: TSection;
};

export type ColumnSpecSectionKeysToColumns = Record<
  string | symbol,
  Record<string, ColumnSpecification>
>;

export type ColumnSpecTabIdsToSectionKeys = Record<
  string,
  ColumnSpecSectionKeysToColumns
>;

export type ColumnSpecDocumentTypesToTabs = Record<
  string,
  ColumnSpecTabIdsToSectionKeys
>;

export type DefaultColumnSpecTabsToColumns = Record<
  string,
  ColumnSpecification[]
>;

export type DefeaultColumnSpecDocumentTypesToTabs = Record<
  string,
  DefaultColumnSpecTabsToColumns
>;

export type DefaultTableColumn = Omit<
  ColumnSpecification,
  'order' | 'priority'
>;

export type DefaultTableColumns = Record<string, DefaultTableColumn>;
