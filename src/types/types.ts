import type { ComponentType, SvelteComponent } from 'svelte';
import type {
  ContainerContents,
  Item5e,
  ItemCardContentComponent,
  ItemChatData,
} from './item.types';
import type {
  OnContentReadyParams,
  OnRenderParams,
  RenderScheme,
} from 'src/api/api.types';
import type {
  RegisteredCustomActorTrait,
  RegisteredPortraitMenuCommand,
} from 'src/runtime/types';
import type { DocumentFilters } from 'src/runtime/item/item.types';
import type { Writable } from 'svelte/store';
import type { UtilityToolbarCommandParams } from 'src/components/utility-bar/types';
import type { CONSTANTS } from 'src/constants';
import type { Dnd5eActorCondition } from 'src/foundry/foundry-and-system';
import type { Group5e } from './group.types';

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
  isClass?: boolean;
  showUsesColumn?: boolean;
  showUsagesColumn?: boolean;
  showLevelColumn?: boolean;
  showRequirementsColumn?: boolean;
  canCreate: boolean;
  custom?: CustomSectionOptions;
} & FeatureSection;

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

export type ActorInventoryTypes = Record<string, InventorySection>;

export type CustomSectionOptions = {
  section: string;
  creationItemTypes: string[];
};

export type InventorySection = {
  items: Item5e[];
  canCreate: boolean;
} & TidySectionBase;

export type GenericFavoriteSection = {
  items: Item5e[];
  canCreate: false;
} & TidySectionBase;

export type EffectFavoriteSection = {
  effects: FavoriteEffectContext[];
  canCreate: false;
} & TidySectionBase;

export type CharacterItemPartitions = {
  items: Item5e[];
  spells: Item5e[];
  feats: Item5e[];
  races: Item5e[];
  backgrounds: Item5e[];
  classes: Item5e[];
  subclasses: Item5e[];
};

export type TidySectionBase = {
  label: string;
  dataset: Record<string, any>;
  custom?: CustomSectionOptions;
  key: string;
  show: boolean; // default: true
  isExternal?: boolean;
};

export type FeatureSection = {
  items: Item5e[];
  hasActions?: boolean;
} & TidySectionBase;

export type VehicleCargoSection = {
  items: Item5e[];
  css?: string;
  editableName?: boolean;
  columns: SimpleEditableColumn[];
} & TidySectionBase;

export type VehicleFeatureSection = {
  crewable?: boolean;
  columns?: SimpleEditableColumn[];
} & FeatureSection;

export type SimpleEditableColumn = {
  label: string;
  css?: string;
  property: string;
  maxProperty?: string;
  editable?: string;
};

export type SpellbookSection = {
  order?: number;
  usesSlots: boolean;
  canCreate: boolean;
  canPrepare: boolean;
  spells: Item5e[];
  uses?: number;
  slots?: number;
  override?: number;
  prop?: string;
} & TidySectionBase;

export type AvailableLevel = {
  level: number;
  delta: number;
  disabled: boolean;
};

export type AttunementContext = { icon: string; cls: string; title: string };

export type CharacterItemContext = {
  attunement?: AttunementContext;
  availableLevels?: AvailableLevel[];
  canToggle?: boolean;
  concealDetails?: boolean;
  containerContents?: ContainerContents;
  favoriteId?: string;
  group?: string;
  hasRecharge?: boolean;
  hasUses?: boolean;
  isStack?: boolean;
  needsSubclass?: boolean;
  toggleClass?: string;
  toggleTitle?: string;
  totalWeight?: number;
  concentration?: boolean;
  parent?: Item5e;
};

export type TypedEffectFavoriteSection = EffectFavoriteSection & {
  type: typeof CONSTANTS.TAB_CHARACTER_EFFECTS;
};

// TODO: Trim to minimum necessary
export type FavoriteEffectContext = {
  effect: ActiveEffect5e;
  effectId: string;
  id: string;
  img: string;
  sort: number;
  subtitle: string;
  suppressed: boolean;
  title: string;
  toggle: {
    applicable: boolean;
    value: boolean;
  };
};

export type FavoriteSection =
  | (InventorySection & { type: typeof CONSTANTS.TAB_ACTOR_INVENTORY })
  | (SpellbookSection & { type: typeof CONSTANTS.TAB_CHARACTER_SPELLBOOK })
  | (CharacterFeatureSection & {
      type: typeof CONSTANTS.TAB_CHARACTER_FEATURES;
    })
  | TypedEffectFavoriteSection
  | (GenericFavoriteSection & {
      type: typeof CONSTANTS.CHARACTER_FAVORITE_SECTION_GENERIC;
    });

export type CharacterSheetContext = {
  actorClassesToImages: Record<string, string>;
  allowMaxHpOverride: boolean;
  appearanceEnrichedHtml: string;
  biographyEnrichedHtml: string;
  bondEnrichedHtml: string;
  conditions: Dnd5eActorCondition[];
  containerPanelItems: ContainerPanelItemContext[];
  epicBoonsEarned: string | undefined;
  favorites: FavoriteSection[];
  features: CharacterFeatureSection[];
  flawEnrichedHtml: string;
  idealEnrichedHtml: string;
  inventory: InventorySection[];
  itemContext: Record<string, CharacterItemContext>;
  maxPreparedSpellsTotal: number;
  notes1EnrichedHtml: string;
  notes2EnrichedHtml: string;
  notes3EnrichedHtml: string;
  notes4EnrichedHtml: string;
  notesEnrichedHtml: string;
  showContainerPanel: boolean;
  preparedSpells: number;
  spellbook: SpellbookSection[];
  spellCalculations: SpellCalculations;
  spellSlotTrackerMode:
    | typeof CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS
    | typeof CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX;
  traitEnrichedHtml: string;
  utilities: Utilities<CharacterSheetContext>;
} & ActorSheetContextV1;

export type NpcAbilitySection = {
  canCreate: boolean;
  custom?: CustomSectionOptions;
  isClass?: boolean;
} & FeatureSection;

export type NpcItemContext = {
  attunement?: AttunementContext;
  availableLevels?: AvailableLevel[];
  canToggle?: boolean;
  concentration?: boolean;
  containerContents?: ContainerContents;
  hasRecharge?: boolean;
  hasUses?: boolean;
  isStack?: boolean;
  needsSubclass?: boolean;
  parent?: Item5e;
  toggleTitle?: string;
  totalWeight?: number;
};

export type NpcSheetContext = {
  appearanceEnrichedHtml: string;
  biographyEnrichedHtml: string;
  bondEnrichedHtml: string;
  conditions: Dnd5eActorCondition[];
  containerPanelItems: ContainerPanelItemContext[];
  encumbrance: any;
  features: NpcAbilitySection[];
  flawEnrichedHtml: string;
  hideEmptySpellbook: boolean;
  idealEnrichedHtml: string;
  inventory: InventorySection[];
  itemContext: Record<string, NpcItemContext>;
  maxPreparedSpellsTotal: number;
  notes1EnrichedHtml: string;
  notes2EnrichedHtml: string;
  notes3EnrichedHtml: string;
  notes4EnrichedHtml: string;
  notesEnrichedHtml: string;
  preparedSpells: number;
  shortRest: (event: Event) => Promise<void>;
  showContainerPanel: boolean;
  showLegendaryToolbar: boolean;
  showSpellbookTab: boolean;
  spellbook: SpellbookSection[];
  spellCalculations: SpellCalculations;
  spellSlotTrackerMode:
    | typeof CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS
    | typeof CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX;
  traitEnrichedHtml: string;
  utilities: Utilities<NpcSheetContext>;
} & ActorSheetContextV1;

export type VehicleItemContext = {
  canToggle?: boolean;
  containerContents?: ContainerContents;
  cover?: string;
  hasUses?: boolean;
  threshold?: number | string;
  toggleClass?: string;
  toggleTitle?: string;
};

export type VehicleEncumbrance = { max: number; value: number; pct: number };

export type VehicleSheetContext = {
  cargo: VehicleCargoSection[];
  encumbrance: VehicleEncumbrance;
  features: VehicleFeatureSection[];
  itemContext: Record<string, VehicleItemContext>;
  utilities: Utilities<VehicleSheetContext>;
} & ActorSheetContextV1;

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
  containerContents?: ContainerContents;
};

export type ActionSection = {
  actions: ActionItem[];
} & TidySectionBase;

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

export type SortModeAlphabetical = 'a';
export type SortModeManual = 'm';
export type SortMode = SortModeAlphabetical | SortModeManual;

export type MessageBus = Writable<MessageBusMessage | undefined>;

export type MessageBusMessage =
  | { tabId: string; message: typeof CONSTANTS.MESSAGE_BUS_EXPAND_ALL }
  | { tabId: string; message: typeof CONSTANTS.MESSAGE_BUS_COLLAPSE_ALL };

export type Utilities<TContext> = Record<
  string,
  {
    utilityToolbarCommands?: UtilityToolbarCommandParams<TContext>[];
  }
>;

type ActorSave = {
  isConcentration: boolean;
  label: string;
  abbr: string;
  mod: number;
  sign: string;
};

type ActorSaves = {
  concentration?: ActorSave;
};

export type ActorSheetContextV1 = {
  actions: ActionSection[];
  activateEditors: (
    node: HTMLElement,
    options?: { bindSecrets?: boolean }
  ) => void;
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
  filterData: DocumentFilters;
  filterPins: Record<string, Set<string>>;
  /** The actor has special save-based roll buttons to be situationally rendered to the sheet. */
  hasSpecialSaves?: boolean;
  /**
   * Represents remaining health as a percentage within the range of `0` to `100`.
   *
   * Note: This calculation ignores temp HP / temp HP Max, because the stock 5e sheets count 0 hp (ignoring all temp values) as incapacitated. Tidy 5e sheets carries this principle forward with health percentage calculation.
   */
  healthPercentage: number;
  isCharacter: boolean;
  isNPC: boolean;
  isVehicle: boolean;
  /** All items without a container. */
  items: Item5e[];
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
  saves: ActorSaves;
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
  warnings: DocumentPreparationWarning[];
} & Record<string, any>;

export type DocumentPreparationWarning = Partial<{
  message: string;
  link: string;
  type: string;
}>;

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

export type ContainerPanelItemContext = {
  container: Item5e;
} & ContainerCapacityContext;

export type ContainerCapacityContext = {
  max: number;
  pct: number;
  value: number;
  units: string;
};

export type ContextMenuOption = {
  name: string;
  icon?: string;
  callback?: () => void;
};

export type RenderableClassicControl<TParams> = {
  component: ComponentType;
  props?: (params: TParams) => Record<string, unknown>;
  visible?: (params: TParams) => boolean;
};

export type AvailableClassLevel = {
  delta: number;
  disabled: boolean;
  level: number;
};

export type DamageModificationData = {
  amount: Record<string, string>;
  bypasses: Set<string>;
};

export type ModificationConsequence = 'benefit' | 'detriment' | 'none';

export type DamageModificationContextEntry = {
  label: string;
  consequence: ModificationConsequence;
  icons?: string[];
};

// TODO: Get the real typings for this
export type ActiveEffect5e = any;

// TODO: Get the real typings for this
export type ActiveEffectContext = {
  id: string;
  name: string;
  img: string;
  disabled: boolean;
  duration: number;
  source: any;
  parentId: string;
  durationParts: string | string[];
  hasTooltip: boolean;
};

export type HTMLElementOrGettable =
  | HTMLElement
  | { get(index: number): HTMLElement };

export type ActorV2 = {
  // TODO: Put universal ActorV2 members here.
  uuid: string;
  update(toUpdate: Record<string, unknown>): Promise<ActorV2 | undefined>;
};

export type ActorSheetContextV2<TActor = ActorV2> = {
  actor: TActor;
  actorPortraitCommands: RegisteredPortraitMenuCommand[];
  editable: boolean;
  healthPercentage: number;
  lockSensitiveFields: boolean;
  unlocked: boolean;
  useRoundedPortraitStyle: boolean;
};
