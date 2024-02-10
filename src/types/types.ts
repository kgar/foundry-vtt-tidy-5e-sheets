import type { ComponentType, SvelteComponent } from 'svelte';
import type { Item5e, ItemCardContentComponent, ItemChatData } from './item';
import type {
  OnContentReadyParams,
  OnRenderParams,
  RenderScheme,
} from 'src/api/api.types';
import type { HtmlContent } from 'src/api/content/HtmlContent';
import type {
  RegisteredCustomActorTrait,
  RegisteredPortraitMenuCommand,
} from 'src/runtime/types';

export type Actor5e = any;

export type SvelteTabContent<
  T extends SvelteComponent<any, any, any> = SvelteComponent<any, any, any>
> = {
  type: 'svelte';
  component: ComponentType<T>;
  cssClass?: string;
  getProps?: (data: any) => Record<string, any>;
  getContext?: (context: Map<any, any>) => Map<any, any>;
};

export type HtmlTabContent = {
  type: 'html';
  html: string;
  cssClass?: string;
  renderScheme: RenderScheme;
};

// TODO: Give better name; this is the prepared HTML that is ready to render
export interface HtmlRuntimeContent {
  type: 'html';
  html: string | ((data: any) => string);
  cssClass?: string;
  renderScheme: RenderScheme;
}

export interface OnRenderTabParams extends OnRenderParams {
  tabContentsElement: HTMLElement;
}

// TODO: Make this generic in such a way that correct props are actually required and that an array of tabs can have hetergeneity of component types without a crazy TS type
export type Tab<
  T extends SvelteComponent<any, any, any> = SvelteComponent<any, any, any>
> = {
  title: string;
  id: string;
  content: SvelteTabContent<T> | HtmlTabContent;
  onRender?: (params: OnRenderTabParams) => void;
  activateDefaultSheetListeners?: boolean;
  autoHeight?: boolean;
};

export type CustomContent = {
  selector?: string;
  position?: string;
  content: HtmlRuntimeContent;
  onContentReady?: (params: OnContentReadyParams) => void;
  onRender?: (params: OnRenderParams) => void;
  activateDefaultSheetListeners?: boolean;
};

export type RenderableCustomActorTrait = RegisteredCustomActorTrait;

export type ClassSummary = {
  class?: string;
  subclass?: string;
  level?: string;
};

export type ItemCardStore = {
  item: Item5e | null;
  itemCardContentTemplate: ItemCardContentComponent | null;
  sheet: HTMLElement;
};

export type CharacterFeatureSection = {
  label: string;
  columns: any;
  items: any;
  dataset: any;
  showUsesColumn: boolean;
  showUsagesColumn: boolean;
  showLevelColumn: boolean;
  showSourceColumn: boolean;
  showRequirementsColumn: boolean;
};

export type SpellCalculations = {
  dc: string;
  dcTooltip: string;
  rangedMod: string;
  rangedTooltip: string;
  rangedHasBonus: boolean;
  meleeMod: string;
  meleeTooltip: string;
  meleeHasBonus: boolean;
};

export type CharacterSheetContext = {
  actorClassesToImages: Record<string, string>;
  allowMaxHpOverride: boolean;
  appearanceEnrichedHtml: string;
  biographyEnrichedHtml: string;
  bondEnrichedHtml: string;
  features: CharacterFeatureSection[];
  flawEnrichedHtml: string;
  idealEnrichedHtml: string;
  maxPreparedSpellsTotal: number;
  notes1EnrichedHtml: string;
  notes2EnrichedHtml: string;
  notes3EnrichedHtml: string;
  notes4EnrichedHtml: string;
  notesEnrichedHtml: string;
  spellCalculations: SpellCalculations;
  traitEnrichedHtml: string;
} & ActorSheetContext &
  Record<string, any>;

export type NpcSheetContext = {
  appearanceEnrichedHtml: string;
  biographyEnrichedHtml: string;
  bondEnrichedHtml: string;
  encumbrance: any;
  flawEnrichedHtml: string;
  hideEmptySpellbook: boolean;
  idealEnrichedHtml: string;
  maxPreparedSpellsTotal: number;
  notes1EnrichedHtml: string;
  notes2EnrichedHtml: string;
  notes3EnrichedHtml: string;
  notes4EnrichedHtml: string;
  notesEnrichedHtml: string;
  shortRest: (event: Event) => Promise<void>;
  showSpellbookTab: boolean;
  spellCalculations: SpellCalculations;
  traitEnrichedHtml: string;
} & ActorSheetContext &
  Record<string, any>;

export type VehicleSheetContext = {} & ActorSheetContext & Record<string, any>;

export type DerivedDamage = {
  label: string;
  formula: string;
  damageType: string;
  damageHealingTypeLabel: string;
};

export type ActionItem = {
  item: Item5e;
  typeLabel: string;
  calculatedDerivedDamage: DerivedDamage[];
  rangeTitle: string | null;
  rangeSubtitle: string | null;
};

type ActionSectionTitle = string;

export type ActorActions = Record<ActionSectionTitle, Set<ActionItem>>;

export type TidyResource = {
  name: string;
  label: string;
  labelName: string;
  placeholder: string;
  value: number | null;
  valueName: string;
  max: number | null;
  maxName: string;
  sr: boolean;
  srName: string;
  lr: boolean;
  lrName: string;
} & ExtensibleComponent;

export type ExtensibleComponent = {
  cssClasses: string[];
  dataset: Record<string, string>;
};

export type ActorSheetContext = {
  actions: ActorActions;
  actor: Actor5e;
  actorPortraitCommands: RegisteredPortraitMenuCommand[];
  allowEffectsManagement: boolean;
  appId: string;
  customActorTraits: RenderableCustomActorTrait[];
  customContent: CustomContent[];
  /**
   * Whether or not the sheet can be edited, regardless of lock/sensitive field settings.
   * When this boolean is `false`, then the sheet is effectively hard locked.
   */
  editable: boolean;
  /**
   * Represents remaining health as a percentage within the range of `0` to `100`.
   *
   * Note: This calculation ignores temp HP / temp HP Max, because the stock 5e sheets count 0 hp (ignoring all temp values) as incapacitated. Tidy 5e sheets carries this principle forward with health percentage calculation.
   */
  healthPercentage: number;
  itemContext: any;
  lockExpChanges: boolean;
  lockHpMaxChanges: boolean;
  /**
   * Item Quantity should be uneditable.
   */
  lockItemQuantity: boolean;
  lockLevelSelector: boolean;
  lockMoneyChanges: boolean;
  lockSensitiveFields: boolean;
  originalContext: unknown;
  /**
   * The current user owns the actor.
   */
  owner: boolean;
  showLimitedSheet: boolean;
  tabs: Tab[];
  tidyResources: TidyResource[];
  /**
   * Tells whether the sheet is unlocked via the Sheet Lock feature. When the sheet lock feature is disabled and the sheet is generally editable, this is always `true`.
   */
  unlocked: boolean;
  useActionsFeature?: boolean;
  useClassicControls: boolean;
  useRoundedPortraitStyle: boolean;
  viewableWarnings: DocumentPreparationWarning[];
} & JQueryHooksSheetIntegration &
  Record<string, any>;

export type DocumentPreparationWarning = Partial<{
  message: string;
  link: string;
  type: string;
}>;

export type JQueryHooksSheetIntegration = {
  activateFoundryJQueryListeners: (html: HTMLElement) => Promise<void>;
};

export type DropdownListOption = { value: any; text: string };

export type PortraitCharmRadiusClass =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'rounded';

export type ItemLayoutMode = 'grid' | 'list';

export type SheetStats = {
  lastSubmissionTime: Date | null;
};

export type CargoOrCrewItem = { name: string; quantity: number };

export type GetFunctionReturnType<T> = T extends {
  get: () => infer V;
}
  ? V
  : never;

export type SheetTabCacheable = {
  onTabSelected: OnTabSelectedFn;
};

export type OnTabSelectedFn = (tabId: string) => void;

export type SheetExpandedItemsCacheable = {
  onItemToggled: OnItemToggledFn;
};

export type OnItemToggledFn = (
  itemId: string,
  isVisible: boolean,
  location: string
) => void;

export type SearchFilterCacheable = {
  onSearch: OnSearchFn;
};

export type OnSearchFn = (location: string, text: string) => void;

/**
 * A map from location to search criteria.
 */
export type LocationToSearchTextMap = Map<string, string>;

/**
 * A map from key Item ID to a set of locations in the sheet, as specified by the item table row during item toggling.
 */
export type ExpandedItemIdToLocationsMap = Map<string, Set<string>>;

/**
 * A map from key Item ID to pre-fetched chat data.
 */
export type ExpandedItemData = Map<string, ItemChatData>;

export type MaxPreparedSpellFormula = {
  label: string;
  value: string;
};