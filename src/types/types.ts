import type { ComponentProps, ComponentType, SvelteComponent } from 'svelte';
import type { Item5e, ItemCardContentComponent, ItemChatData } from './item';

export type Actor5e = any;

export type SvelteTabContent<
  T extends SvelteComponent<any, any, any> = SvelteComponent<any, any, any>
> = {
  component: ComponentType<T>;
  props?: ComponentProps<T>;
  cssClass?: string;
};

export type HtmlTabContent = {
  html: string;
  render?: (tabContent: HTMLElement) => void;
  rerenderOnSubmit?: boolean;
  cssClass?: string;
};

// TODO: Make this generic in such a way that correct props are actually required and that an array of tabs can have hetergeneity of component types without a crazy TS type
export type Tab<
  T extends SvelteComponent<any, any, any> = SvelteComponent<any, any, any>
> = {
  id: string;
  displayName: string;
  content: SvelteTabContent<T> | HtmlTabContent;
};

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
  notes1EnrichedHtml: string;
  notes2EnrichedHtml: string;
  notes3EnrichedHtml: string;
  notes4EnrichedHtml: string;
  notesEnrichedHtml: string;
  shortRest: (event: Event) => Promise<void>;
  showSpellbookTab: boolean;
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
  allowEffectsManagement: boolean;
  appId: string;
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
  useActionsFeature?: boolean;
  useClassicControls: boolean;
  useRoundedPortraitStyle: boolean;
} & JQueryHooksSheetIntegration &
  Record<string, any>;

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
