import type { ComponentProps, ComponentType, SvelteComponent } from 'svelte';
import type { Item5e, ItemCardContentComponent, ItemChatData } from './item';
import type { Writable } from 'svelte/store';

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
  showUsesColumn: boolean;
  showUsagesColumn: boolean;
  showLevelColumn: boolean;
  showSourceColumn: boolean;
  showRequirementsColumn: boolean;
};

export type CharacterSheetContext = {
  actorClassesToImages: Record<string, string>;
  allowMaxHpOverride: boolean;
  characterJournalTabDisabled: boolean;
  features: CharacterFeatureSection[];
  traitEnrichedHtml: string;
  idealEnrichedHtml: string;
  bondEnrichedHtml: string;
  flawEnrichedHtml: string;
  appearanceEnrichedHtml: string;
  biographyEnrichedHtml: string;
  notesEnrichedHtml: string;
  notes1EnrichedHtml: string;
  notes2EnrichedHtml: string;
  notes3EnrichedHtml: string;
  notes4EnrichedHtml: string;
} & ActorSheetContext &
  Record<string, any>;

export type NpcSheetContext = {
  encumbrance: any;
  hideSpellbookTab: boolean;
  hideEmptySpellbook: boolean;
  shortRest: (event: Event) => Promise<void>;
  traitEnrichedHtml: string;
  idealEnrichedHtml: string;
  bondEnrichedHtml: string;
  flawEnrichedHtml: string;
  appearanceEnrichedHtml: string;
  biographyEnrichedHtml: string;
  notesEnrichedHtml: string;
  notes1EnrichedHtml: string;
  notes2EnrichedHtml: string;
  notes3EnrichedHtml: string;
  notes4EnrichedHtml: string;
} & ActorSheetContext &
  Record<string, any>;

export type VehicleSheetContext = {} & ActorSheetContext & Record<string, any>;

export type ActorSheetContext = {
  actor: Actor5e;
  allowEffectsManagement: boolean;
  appId: string;
  classicControlsEnabled: boolean;
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
  useRoundedPortraitStyle: boolean;
} & JQueryHooksSheetIntegration;

export type JQueryHooksSheetIntegration = {
  activateFoundryJQueryListeners: (html: HTMLElement) => Promise<void>;
};

export interface Resource {
  value: number;
  max: number;
  sr: boolean;
  lr: boolean;
  label: string;
  name: string;
  placeholder: string;
}

export interface ActorContextSkill {
  value: number;
  ability: string;
  bonuses: ActorContextSkillBonuses;
  bonus: number;
  mod: number;
  prof: ActorContextSkillProficiency;
  proficient: number;
  total: number;
  passive: number;
  abbreviation: string;
  icon: string;
  hover: string;
  label: string;
  baseValue: number;
}

export interface ActorContextSkillBonuses {
  check: string;
  passive: string;
}

export interface ActorContextSkillProficiency {
  _baseProficiency: number;
  multiplier: number;
  rounding: string;
}

export type TidyDropdownOption = { value: any; text: string };

export type PortraitCharmRadiusClass =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'rounded';

export type ItemLayoutMode = 'grid' | 'list';

export type DropdownOption = { text: string; value: string };

export type globalThisUI = {
  notifications: ClientNotifications;
};

type ClientNotifications = {
  error(message: string, options?: Partial<NotifyOptions>): void;
  info(message: string, options?: Partial<NotifyOptions>): void;
  warn(message: string, options?: Partial<NotifyOptions>): void;
};

type NotifyOptions = {
  permanent: boolean;
  localize: boolean;
  console: boolean;
};

export type D20Roll = Roll & {
  // TODO: Populate if needed
};

export type Roll = {
  // TODO: Populate if needed
};

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

export type OnSearchFn = (filterId: string, text: string) => void;

export type SearchFilterIdToTextMap = Map<string, string>;

/**
 * A map from key Item ID to a set of locations in the sheet, as specified by the item table row during item toggling.
 */
export type TidyExpandedItems = Map<string, Set<string>>;

/**
 * A map from key Item ID to pre-fetched chat data.
 */
export type TidyExpandedItemData = Map<string, ItemChatData>;
