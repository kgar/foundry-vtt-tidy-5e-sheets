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
} from 'src/types/types';
import type { ClassValue, HTMLAttributes } from 'svelte/elements';
import type { SectionOptionGroup } from 'src/settings/editors/sheet-tab-options-settings-editor.svelte';

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

export type SheetSectionConfiguration = {
  key: string;
  label: string;
  show: boolean;
};

export type TabOptions = {
  tabId: string;
  sections: SheetSectionConfiguration[];
  defaultSections: SheetSectionConfiguration[];
  optionsGroups?: SectionOptionGroup[];
  formTitle?: string;
};

export type TabOptionsBuilder<TContext> = (
  context: TContext,
  tabId: string,
) => TabOptions | undefined;

export type RegisteredTab<TContext> = {
  enabled?: (context: TContext) => boolean;
  layout: SheetLayout;
  title: CustomTabTitle;
  iconClass?: string;
  id: string;
  content: SvelteTabContent | RenderableHtml | HandlebarsTemplateRenderer;
  onRender?: (args: OnRenderTabParams) => void;
  renderScheme?: RenderScheme;
  tabContentsAttributes?: HTMLAttributes<HTMLElement>;
  tabContentsClasses?: string[];
  getData?: (data: any) => any | Promise<any>;
  autoHeight?: boolean;
  itemCount?: (context: any) => number;
  types?: Set<string>;
  tabOptionsBuilder?: TabOptionsBuilder<TContext>;
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

export type RegisteredSectionCommand = {
  label?: string;
  iconClass?: string;
  tooltip?: string;
  enabled?: (params: RegisteredSectionCommandEnabledParams) => boolean;
  execute?: (params: RegisteredSectionCommandExecuteParams) => void;
};

export type RegisteredSectionCommandEnabledParams = {
  document: any;
  section: any;
  unlocked: boolean;
};
export type RegisteredSectionCommandExecuteParams = {
  document: any;
  section: any;
  event: Event;
};

export type RegisteredCustomActorTrait = {
  title: string;
  alwaysShow: boolean | undefined;
  openConfiguration:
    ((params: RegisteredTraitOpenConfigurationParams) => void) | undefined;
  openConfigurationTooltip: string | undefined;
  enabled?: ((params: CustomTraitEnabledParams) => boolean) | undefined;
  iconClass: string | undefined;
  pills:
    | ((
        params: RegisteredCustomTraitRenderParams,
      ) => RegisteredCustomTraitEntry[])
    | undefined;
  content: ((params: RegisteredCustomTraitRenderParams) => string) | undefined;
};

export type RegisteredCustomTraitEntry = {
  /**
   * An optional handler for when the pill is clicked. If a function is provided, then the pill will render as an interactive HTML element such as an anchor or a button.
   * Parameters:
   *   - app - the sheet instance.
   *   - document - the relevant Foundry document.
   *   - context - the Tidy prepared context data. Use as your own risk.
   */
  onClick?: (params: RegisteredCustomTraitOnClickParams) => void;
  /** 
    Custom HTML content, to appear to the right of any specified icons and before any other content.
    This content is specifically rendered as HTML, unlike the more specific building blocks.
   */
  content?: string;

  /* -------------------------------------------- */
  /*  Curated pill content                        */
  /* -------------------------------------------- */
  /* The below content is assembled with Tidy-specific markup and classes to form common pills. */

  /** Icons associated with the trait. */
  icons?: { icon: string; label: string }[];
  /** Text that describes the trait. */
  label: string;
  /** The number sign (+ or -) for a numeric trait. */
  sign?: string;
  /** A value associated with the trait. */
  value?: string;
  /** The localized units abbreviation. */
  units?: string;
  /** The units key for CONFIG.DND5E purposes. */
  unitsKey?: string;
  /**
   * Optional classes to apply to the resulting trait UI element. Any clsx value is permissible.
   *
   * @example ['your-classes', 'canBeListed', { ['in-a-variety']: true, ['of-ways']: false}]
   * @example 'your-classes canBeListed in-a-variety of-ways'
   *
   * @see {@link https://svelte.dev/docs/svelte/class}
   * @see {@link https://github.com/lukeed/clsx?tab=readme-ov-file#usage}
   */
  cssClass?: ClassValue;
  /** Any information that should appear in parentheses after the main trait context info. */
  parenthetical?: string;
};

export type RegisteredCustomTraitOnClickParams = {
  app: any;
  element: HTMLElement;
  context: any;
  event: MouseEvent;
};

export type CustomTraitEnabledParams = {
  app: any;
  element: HTMLElement;
  context: any;
};

export type RegisteredCustomTraitRenderParams = {
  app: any;
  element: HTMLElement;
  data: any;
};

export type RegisteredTraitOpenConfigurationParams = {
  app: any;
  element: HTMLElement;
  data: any;
  event: Event;
};

export type ContainerContentsRowActionsContext = {
  unlocked: boolean;
  owner: boolean;
  // TODO: Do we really need this field? Surely we can figure this out with `item.actor`
  hasActor: boolean;
};
