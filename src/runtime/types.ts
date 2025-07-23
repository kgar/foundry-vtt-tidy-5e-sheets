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
  Actor5e,
  RenderableHtml,
  OnRenderTabParams,
  SvelteTabContent,
  ActorSheetContextV1,
  ActorSheetClassicContextV2,
  TidySectionBase,
} from 'src/types/types';
import type { Component } from 'svelte';
import type { TidyTableAction } from 'src/components/table-quadrone/table-buttons/table.types';

export type RegisteredContent<TContext> = {
  content: SvelteTabContent | RenderableHtml | HandlebarsTemplateRenderer;
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
  content: SvelteTabContent | RenderableHtml | HandlebarsTemplateRenderer;
  onRender?: (args: OnRenderTabParams) => void;
  renderScheme?: RenderScheme;
  tabContentsClasses?: string[];
  getData?: (data: any) => any | Promise<any>;
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

export type DefaultColumnSpecDocumentTypesToTabs = Record<
  string,
  DefaultColumnSpecTabsToColumns
>;

export type DefaultTableColumn = Omit<
  ColumnSpecification,
  'order' | 'priority'
>;

export type DefaultTableColumns = Record<string, DefaultTableColumn>;

/**
 * The current and maximum possible number of inspiration points.
 */
export type BankedInspirationCount = {
  value: number;
  max: number;
};

/**
 * The necessary configuration to allow for externally-controlled
 * banked inspiration on actors, utilizing any source of data.
 * This configuration applies to all actors, so care is required
 */
export type BankedInspirationConfiguration = {
  /**
   * The actor sheet would like for you to adjust the inspiration value by the delta amount.
   * Apply your changes, or ignore change requests per your own validation rules, as part of this callback.
   * @param app the actor sheet instance
   * @param actor the actor
   * @param delta the proposed change in value. This delta is added to the current value. It will generally be 1 or -1.
   * @returns
   */
  change: (app: any, actor: any, delta: number) => Promise<void>;
  /**
   * Required callback function which provides inspiration value/max information.
   * This callback will be invoked on every render cycle when preparing actor context data.
   *
   * @param app the actor sheet instance
   * @param actor the actor
   * @returns the current inspiration value and max
   */
  getData: (
    app: any,
    actor: any
  ) => BankedInspirationCount | Promise<BankedInspirationCount>;
};