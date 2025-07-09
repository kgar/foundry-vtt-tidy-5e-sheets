import type { Component } from 'svelte';
import type {
  ContainerContents,
  CurrencyContext,
  Item5e,
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
import type { UtilityToolbarCommandParams } from 'src/components/utility-bar/types';
import type { CONSTANTS } from 'src/constants';
import type { Dnd5eActorCondition } from 'src/foundry/foundry-and-system';
import type { Activity5e, SkillData, ToolData } from 'src/foundry/dnd5e.types';
import type {
  DocumentJournalEntries,
  AttributePinFlag,
} from 'src/foundry/TidyFlags.types';
import type { DataField, DataSchema, SchemaField } from 'foundry.data.fields';
import type { Ability } from './dnd5e.actor5e.types';
import type { ClassValue, HTMLAttributes } from 'svelte/elements';
import type { Tidy5eCharacterSheetQuadrone } from 'src/sheets/quadrone/Tidy5eCharacterSheetQuadrone.svelte';
import type { TidyTableAction } from 'src/components/table-quadrone/table-buttons/table.types';
import type { UserPreferences } from 'src/features/user-preferences/user-preferences.types';

export type Actor5e = any;
export type TokenDocument = any;

export type SvelteTabContent = {
  type: 'svelte';
  component: Component<any>;
  cssClass?: string;
  getProps?: (data: any) => Record<string, any>;
  getContext?: (context: Map<any, any>) => Map<any, any>;
};

export interface RenderedHtml {
  type: 'html';
  html: string;
  cssClass?: string;
  renderScheme: RenderScheme;
}

export interface RenderableHtml {
  type: 'html';
  html: string | ((data: any) => string);
  cssClass?: string;
  renderScheme: RenderScheme;
  getData?: (context: any) => any | Promise<any>;
}

export interface OnRenderTabParams extends OnRenderParams {
  tabContentsElement: HTMLElement;
}

// TODO: Make this generic in such a way that correct props are actually required and that an array of tabs can have hetergeneity of component types without a crazy TS type
export type Tab = {
  title: string;
  id: string;
  content: SvelteTabContent | RenderedHtml;
  onRender?: (params: OnRenderTabParams) => void;
  autoHeight?: boolean;
  condition?: (document: any) => boolean;
  iconClass?: string;
  itemCount?: (context: any) => number;
  attributes?: HTMLAttributes<HTMLElement>;
};

export type CustomContent = {
  selector?: string;
  position?: string;
  content: RenderableHtml;
  onContentReady?: (params: OnContentReadyParams) => void;
  onRender?: (params: OnRenderParams) => void;
};

export type RenderableCustomActorTrait = RegisteredCustomActorTrait;

export type ClassSummary = {
  class?: string;
  subclass?: string;
  level?: string;
};

export type TidyItemSectionBase = {
  items: Item5e[];
} & TidySectionBase;

export type CharacterFeatureSection = {
  isClass?: boolean;
  showUsesColumn?: boolean;
  showUsagesColumn?: boolean;
  showLevelColumn?: boolean;
  showFeatureTypeColumn?: boolean;
  showRequirementsColumn?: boolean;
  canCreate: boolean;
  custom?: CustomSectionOptions;
} & FeatureSection;

export type SpellcastingInfo = {
  currentFilteredClass: Item5e;
  calculations: SpellCalculations;
  prepared?: {
    value: number;
    max: number;
  };
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

export type LinkedUses = {
  value: number;
  max: number;
  valueProp: string;
  spentProp: string;
  maxProp: string;
  doc: any;
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
  facilities: Item5e[];
  feats: Item5e[];
  species: Item5e[];
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
  // columns: ColumnsLoadout[];
  rowActions: TidyTableAction<any, any, any>[];
};

export type FeatureSection = {
  items: Item5e[];
  hasActions?: boolean;
  hasUses?: boolean;
} & TidySectionBase;

export type FacilitySection = {
  items: Item5e[];
} & TidySectionBase;

export type ActivitySection = {
  activities: Activity5e[];
} & TidySectionBase;

export type TypedActivityFavoriteSection = ActivitySection & {
  type: typeof CONSTANTS.FAVORITES_SECTION_TYPE_ACTIVITY;
};

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

export type SpellbookSectionLegacy = {
  order: number;
  label: string;
  usesSlots: boolean;
  canCreate: boolean;
  canPrepare: boolean;
  spells: Item5e[];
  uses: number | string;
  slots: number | string;
  override: number;
  dataset: {
    type: string;
    ['system.level']: number;
    ['system.preparation.mode']: string;
  };
  prop: string;
  editable: boolean;
  prepMode?: string;
};

export type SpellbookSection = {
  order?: number | string;
  usesSlots: boolean;
  canCreate: boolean;
  /* deprecated: item row actions runtime evaluates for each item  */
  canPrepare: boolean;
  spells: Item5e[];
  uses?: number;
  slots?: number;
  override?: number;
  prop?: string;
  prepMode?: string;
} & TidySectionBase;

export type AvailableLevel = {
  level: number;
  delta: number;
  disabled: boolean;
};

export type AttunementContext = { icon: string; cls: string; title: string };

export type ItemSaveContext = {
  ability: string;
  abilityTitle: string;
  multipleAbilities: boolean;
  dc: {
    calculation: string;
    formula: string;
    value: number;
  };
};

export type CharacterItemContext = {
  actionSubtitle?: string; // Quadrone only
  activities?: ActivityItemContext[];
  attunement?: AttunementContext;
  availableLevels?: AvailableLevel[];
  chosen?: ChosenFacilityContext;
  concealDetails?: boolean;
  containerContents?: ContainerContents;
  favoriteId?: string;
  group?: string;
  hasRecharge?: boolean;
  hasUses?: boolean;
  isStack?: boolean;
  linkedUses?: LinkedUses;
  needsSubclass?: boolean;
  save?: ItemSaveContext;
  toHit?: number | null;
  totalWeight?: number;
  concentration?: boolean;
  parent?: Item5e;
  subtitle?: string;
};

export type ActivityItemContext = {
  activation: string;
  hasRecharge: boolean;
  isOnCooldown: boolean;
  id: string;
  activity: Activity5e;
  save: {
    ability: string;
  } | null;
  toHit: number | null;
};

export type TypedEffectFavoriteSection = EffectFavoriteSection & {
  type: typeof CONSTANTS.FAVORITES_SECTION_TYPE_EFFECT;
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
  | (InventorySection & {
      type: typeof CONSTANTS.FAVORITES_SECTION_TYPE_INVENTORY;
    })
  | (FacilitySection & {
      type: typeof CONSTANTS.FAVORITES_SECTION_TYPE_FACILITY;
    })
  | (SpellbookSection & {
      type: typeof CONSTANTS.FAVORITES_SECTION_TYPE_SPELLBOOK;
    })
  | (CharacterFeatureSection & {
      type: typeof CONSTANTS.FAVORITES_SECTION_TYPE_FEATURE;
    })
  | TypedActivityFavoriteSection
  | TypedEffectFavoriteSection
  | (GenericFavoriteSection & {
      type: typeof CONSTANTS.FAVORITES_SECTION_TYPE_GENERIC;
    });

export type LanguageTraitContext = {
  label: string;
  value?: unknown;
};

export type AttributeItemPinContext = {
  document: Item5e;
  linkedUses?: LinkedUses;
} & AttributePinFlag & { type: 'item' };

export type AttributeActivityPinContext = {
  document: Activity5e;
} & AttributePinFlag & { type: 'activity' };

export type AttributePinContext =
  | AttributeItemPinContext
  | AttributeActivityPinContext;

export type CharacterFacilitiesContext = {
  basic: {
    available: AvailableBastionActionContext[];
    chosen: ChosenFacilityContext[];
    max: number;
    value: number;
  };
  special: {
    available: AvailableBastionActionContext[];
    chosen: ChosenFacilityContext[];
    max: number;
    value: number;
  };
} & Record<
  string,
  {
    available: AvailableBastionActionContext[];
    chosen: ChosenFacilityContext[];
    max: number;
    value: number;
  }
>;

export type CharacterSheetContext = {
  actorClassesToImages: Record<string, string>;
  allowMaxHpOverride: boolean;
  appearanceEnrichedHtml: string;
  attributePins: AttributePinContext[];
  bastion: {
    description: string;
  };
  biographyEnrichedHtml: string;
  bondEnrichedHtml: string;
  conditions: Dnd5eActorCondition[];
  containerPanelItems: ContainerPanelItemContext[];
  defenders: Actor5e[];
  effects: Record<string, EffectCategory<ActiveEffectContext>>;
  epicBoonsEarned: string | undefined;
  facilities: CharacterFacilitiesContext;
  favorites: FavoriteSection[];
  features: CharacterFeatureSection[];
  flawEnrichedHtml: string;
  idealEnrichedHtml: string;
  inventory: InventorySection[];
  itemContext: Record<string, CharacterItemContext>;
  languages: LanguageTraitContext[];
  notes1EnrichedHtml: string;
  notes2EnrichedHtml: string;
  notes3EnrichedHtml: string;
  notes4EnrichedHtml: string;
  notesEnrichedHtml: string;
  showContainerPanel: boolean;
  spellComponentLabels: Record<string, string>;
  spellbook: SpellbookSection[];
  spellcastingInfo: SpellcastingInfo;
  spellSlotTrackerMode:
    | typeof CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS
    | typeof CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX;
  traitEnrichedHtml: string;
  utilities: Utilities<CharacterSheetContext>;
} & ActorSheetContextV1;

/** A list of available actions that can be done on behalf of a facility type. */
type AvailableBastionActionContext = {
  label: string;
};

export type ChosenFacilityContext = {
  id: string;
  labels: {
    order: string;
  };
  name: string;
  building: {
    built: boolean;
    size: string;
  };
  disabled: boolean;
  free: boolean;
  progress: {
    value: number;
    max: number;
    order: string;
    pct: number;
  };
  craft: Item5e | null;
  creatures: FacilityOccupantContext[];
  defenders: FacilityOccupantContext[];
  executing: string | undefined;
  hirelings: FacilityOccupantContext[];
  img: string;
  isSpecial: boolean;
  subtitle: string;
  facility: Item5e;
};

export type FacilityOccupantContext = {
  /** If present, the occupant's source actor was found. If undefined, then this is a broken link. */
  actor?: Actor5e;
  /** If present, this indicates there is an occupant configured to be here. */
  uuid?: string;
};

export type NpcAbilitySection = {
  canCreate: boolean;
  custom?: CustomSectionOptions;
  isClass?: boolean;
} & FeatureSection;

export type NpcItemContext = {
  actionSubtitle?: string; // Quadrone only
  activities?: ActivityItemContext[];
  attunement?: AttunementContext;
  availableLevels?: AvailableLevel[];
  canToggle?: boolean;
  concentration?: boolean;
  containerContents?: ContainerContents;
  hasRecharge?: boolean;
  hasUses?: boolean;
  isStack?: boolean;
  linkedUses?: LinkedUses;
  needsSubclass?: boolean;
  parent?: Item5e;
  save?: ItemSaveContext;
  toHit?: number | null;
  toggleTitle?: string;
  totalWeight?: number;
  subtitle?: string;
};

export type NpcHabitat = {
  type: string;
  subtype?: string;
};

export type NpcSheetContext = {
  appearanceEnrichedHtml: string;
  biographyEnrichedHtml: string;
  bondEnrichedHtml: string;
  conditions: Dnd5eActorCondition[];
  containerPanelItems: ContainerPanelItemContext[];
  defaultSkills: Set<string>;
  features: NpcAbilitySection[];
  flags: SpecialTraits;
  flawEnrichedHtml: string;
  hasLegendaries: boolean;
  habitat: { label: string }[];
  hideEmptySpellbook: boolean;
  idealEnrichedHtml: string;
  inventory: InventorySection[];
  itemContext: Record<string, NpcItemContext>;
  languages: LanguageTraitContext[];
  notes1EnrichedHtml: string;
  notes2EnrichedHtml: string;
  notes3EnrichedHtml: string;
  notes4EnrichedHtml: string;
  notesEnrichedHtml: string;
  showContainerPanel: boolean;
  showLoyalty: boolean;
  showSpellbookTab: boolean;
  spellComponentLabels: Record<string, string>;
  spellbook: SpellbookSection[];
  spellcastingInfo: SpellcastingInfo;
  spellSlotTrackerMode:
    | typeof CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS
    | typeof CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX;
  traitEnrichedHtml: string;
  treasure: { label: string }[];
  utilities: Utilities<NpcSheetContext>;
} & ActorSheetContextV1;

export type VehicleItemContext = {
  actionSubtitle?: string;
  activities?: ActivityItemContext[];
  canToggle?: boolean;
  containerContents?: ContainerContents;
  cover?: string;
  hasUses?: boolean;
  save?: ItemSaveContext;
  toHit?: number | null;
  threshold?: number | string;
  toggleClass?: string;
  toggleTitle?: string;
};

export type VehicleSheetContext = {
  cargo: VehicleCargoSection[];
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

export type ActionSectionClassic = {
  actions: ActionItem[];
} & TidySectionBase;

export type ExtensibleComponent = {
  cssClasses: string[];
  dataset: Record<string, string>;
};

export type MessageBus = { message: MessageBusMessage | undefined };

export type MessageBusMessage =
  | {
      tabId: string;
      message: typeof CONSTANTS.MESSAGE_BUS_EXPAND_ALL;
      options?: { includeInlineToggles?: boolean };
    }
  | {
      tabId: string;
      message: typeof CONSTANTS.MESSAGE_BUS_COLLAPSE_ALL;
      options?: { includeInlineToggles?: boolean };
    };

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

export type ActorSaves = {
  concentration?: ActorSave;
};

export type EncumbranceContext = {
  value: number;
  max: number;
  pct: number;
  encumbered?: boolean;
  stops?: {
    encumbered: number;
    heavilyEncumbered: number;
  };
};

export type SpecialTraitSectionField = {
  field: DataField; // A data field subclass from Foundry or dnd5e
  hint?: string;
  input?: any; // A function that receives field and config; e.g., createCheckboxInput(field, config)
  name: string;
  section?: string; // Seems superfluous
  type?: any; // Boolean(), String(), Number(), etc.
  placeholder?: any; // A placeholder of the specified type; e.g., 30
  value?: any;
};

export type SpecialTraitClass = {
  label: string;
  value: string;
};

export type SpecialTraitSection = {
  label: string;
  fields: SpecialTraitSectionField[];
};

export type SpecialTraits = {
  classes: SpecialTraitClass[];
  data: Record<string, any>;
  sections: SpecialTraitSection[];
};

export type DocumentSheetV2Context = {
  document: any;
  /**
   * Whether or not the sheet can be edited, regardless of lock/sensitive field settings.
   * When this boolean is `false`, then the sheet is effectively hard locked.
   */
  editable: boolean;
  fields: Record<string, SchemaField>;
  rootId: string;
  source: Record<string, any>;
  /**
   * Tells whether the sheet is unlocked via the Sheet Mode feature.
   */
  unlocked: boolean;
  user: any;
};

export type ActorSheetContextV1 = {
  abilities: any;
  actions: ActionSectionClassic[];
  actor: Actor5e;
  actorPortraitCommands: RegisteredPortraitMenuCommand[];
  allowEffectsManagement: boolean;
  appId: string;
  biographyHTML: string;
  config: typeof CONFIG.DND5E;
  customActorTraits: RenderableCustomActorTrait[];
  customContent: CustomContent[];
  disableExperience: boolean;
  effects: Record<string, EffectCategory<ActiveEffect5e>>;
  elements: unknown;
  encumbrance?: EncumbranceContext;
  filterData: DocumentFilters;
  filterPins: Record<string, Set<string>>;
  flags: SpecialTraits; // TODO: Type it
  /** The actor has special save-based roll buttons to be situationally rendered to the sheet. */
  hasSpecialSaves?: boolean;
  /**
   * Represents remaining health as a percentage within the range of `0` to `100`.
   *
   * Note: This calculation ignores temp HP / temp HP Max, because the stock 5e sheets count 0 hp (ignoring all temp values) as incapacitated. Tidy 5e sheets carries this principle forward with health percentage calculation.
   */
  healthPercentage: number;
  hp: {
    value: number;
    max: number;
    temp?: number;
    tempmax?: number;
  };
  isCharacter: boolean;
  isNPC: boolean;
  isVehicle: boolean;
  limited: boolean;
  itemContext: Record<string, any>; // TODO: Consider adding itemContext generic
  /** All items without a container. */
  items: Item5e[];
  labels: Record<string, any>;
  lockExpChanges: boolean;
  lockHpMaxChanges: boolean;
  /**
   * Item Quantity should be uneditable.
   */
  lockItemQuantity: boolean;
  lockLevelSelector: boolean;
  lockMoneyChanges: boolean;
  lockSensitiveFields: boolean;
  modernRules: boolean;
  movement: {
    primary: string;
    special?: string;
    secondary?: string;
  };
  options: unknown;
  overrides: unknown;
  /**
   * The current user owns the actor.
   */
  owner: boolean;
  saves: ActorSaves;
  rollData: unknown;
  senses: unknown;
  skills: any;
  showLimitedSheet: boolean;
  system: any;
  tabs: Tab[];
  tools: any;
  traits: any;
  useActionsFeature?: boolean;
  useClassicControls: boolean;
  useRoundedPortraitStyle: boolean;
  viewableWarnings: DocumentPreparationWarning[];
  warnings: DocumentPreparationWarning[];
} & DocumentSheetV2Context;

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

export type EffectSummaryData = {
  description: {
    value: string;
  };
};

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

export type RenderableClassicControl<TParams> = {
  component: Component<any>;
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

export type EffectCategory<TEffectContext> = {
  type: string;
  label: string;
  effects: TEffectContext[];
  hidden?: boolean;
  // For enchantment/enchantmentActive/enchantmentInactive
  isEnchantment?: boolean;
  // For suppressed effects
  disabled?: boolean;
  // For suppressed effects
  info?: string[];
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
  parent: any;
  parentId: string;
  durationParts: string | string[];
  hasTooltip: boolean;
  uuid: string;
  effect: ActiveEffect5e;
};

export type HTMLElementOrGettable =
  | HTMLElement
  | { get(index: number): HTMLElement };

export type ActorV2 = {
  isOwner: boolean;
  // TODO: Put universal ActorV2 members here.
  uuid: string;
  update(toUpdate: Record<string, unknown>): Promise<ActorV2 | undefined>;
} & {};

// TODO: Deprecate
export type ActorSheetClassicContextV2<TActor = ActorV2> = {
  actor: TActor;
  actorPortraitCommands: RegisteredPortraitMenuCommand[];
  customContent: CustomContent[];
  editable: boolean;
  healthPercentage: number;
  modernRules: boolean;
  lockSensitiveFields: boolean;
  tabs: Tab[];
  unlocked: boolean;
  useRoundedPortraitStyle: boolean;
};

export type GroupableSelectOption = {
  value: string;
  label: string;
  group?: string;
};

/* Quadrone Types */
export type DocumentSheetQuadroneContext<TDocument> = {
  document: TDocument;
  editable: boolean;
  fields: any;
  rootId: string;
  source: any;
  unlocked: boolean;
  user: any;
};

export type ActorSizeContext = {
  key: string;
  label: string;
  abbr: string;
  mod: number;
};

export type ActorTraitContext<TValue = unknown> = {
  key?: string;
  icons?: { icon: string; label: string }[];
  label: string;
  sign?: string;
  value?: TValue;
  units?: string;
  cssClass?: ClassValue;
};

export type ActorSheetQuadroneContext<TSheet = any> = {
  abilities: ActorAbilityContextEntry[];
  actions: TidyItemSectionBase[];
  actor: { sheet: TSheet } & Record<string, any>;
  appId: string; // do we need this ? or is rootId sufficient?
  config: typeof CONFIG.DND5E;
  customActorTraits: RenderableCustomActorTrait[];
  customContent: CustomContent[];
  effects: Record<string, EffectCategory<ActiveEffectContext>>;
  elements: unknown;
  enableXp: boolean;
  fields: DataSchema;
  filterData: DocumentFilters;
  filterPins: Record<string, Set<string>>;
  currentTabId: string;
  isConcentrating: boolean;
  itemContext: Record<string, any>; // TODO: Consider adding itemContext generic
  /** All items without a container. */
  items: Item5e[];
  journal: DocumentJournalEntries;
  labels: Record<string, any>;
  limited: boolean;
  modernRules: boolean;
  owner: boolean;
  rollData: any;
  saves: ActorSaves;
  source: any;
  system: Actor5e['system'];
  tabs: Tab[];
  token: TokenDocument | null;
  traits: Record<string, ActorTraitContext[]>;
  userPreferences: UserPreferences;
  warnings: DocumentPreparationWarning[];
} & DocumentSheetQuadroneContext<Actor5e>;

export type ActorAbilityContextEntry = Ability & {
  key: string; // For saving
  abbr: string; // the visible abbreviation button label
  hover: string; // not used? probably tooltip
  icon: string; // not used? probably tooltip
  label: string; // tooltip and aria label
  source: Ability; // source.value on the input
};

export type CharacterSpeedSenseContext = {
  main: ActorSpeedSenseEntryContext[];
  secondary: ActorSpeedSenseEntryContext[];
  traitEntries: ActorTraitContext[];
};

export type ActorSpeedSenseEntryContext = {
  key: string;
  label: string;
  value: string;
  units: string;
} & ActorTraitContext;

export type CharacterClassEntryContext = {
  uuid: string;
  name: string;
  img: string;
  item: Item5e;
  levels: number;
  isOriginalClass: boolean;
  // TODO: Consider boosting so that it can be used for spellcasting cards
  spellcasting?: {
    dc: number;
    ability: string;
  };
  availableLevels: AvailableClassLevel[];
  subclass?: Item5e;
  needsSubclass: boolean;
};

export type CreatureTypeContext = {
  icon: string;
  title?: string;
  subtitle?: string;
  reference?: string;
};

export type ActorSkillsToolsContext<T> = {
  key: string;
  abbreviation: string;
  baseAbility: string;
  hover: string;
  label: string;
  source: T | undefined;
} & T;

export type ItemFavoriteContextEntry = {
  id: string;
  type: 'item';
  item: Item5e;
  capacity?: ContainerCapacityContext;
};

export type EffectFavoriteContextEntry = {
  id: string;
  type: 'effect';
  effect: ActiveEffect5e;
};

export type ActivityFavoriteContextEntry = {
  id: string;
  type: 'activity';
  activity: Activity5e;
};

export type SlotsFavoriteContextEntry = {
  type: 'slots';
  id: string;
  img?: string;
  level?: number;
  name: string;
  uses: { value: number; max: number; field: string };
};

export type SkillToolFavoriteContextEntry = {
  type: 'skill' | 'tool';
  id: string;
  img?: string;
  key: string | null;
  name: string;
  reference?: string;
};

export type SpellcastingContext = {
  name: string;
  classIdentifier: string;
  ability: {
    key: string;
    label: string;
    mod: {
      sign: string;
      value: string;
    };
  };
  attack: {
    mod: {
      sign: string;
      value: string;
    };
  };
  save: number;
  primary: boolean;
  prepared: {
    value: string;
    max?: string;
  };
};

export type FavoriteContextEntry =
  | ItemFavoriteContextEntry
  | EffectFavoriteContextEntry
  | ActivityFavoriteContextEntry
  | SlotsFavoriteContextEntry
  | SkillToolFavoriteContextEntry;

export type SystemSettings = {
  currencyWeight: boolean;
};

export type InspirationSource = {
  change: (delta: number) => Promise<void>;
  value: number;
  max: number;
  itemId?: string;
};

export type ActorTraitItemContext = {
  id: string;
  name: string;
  img: string;
};

export type CharacterSheetQuadroneContext = {
  background?: ActorTraitItemContext;
  // TODO: Populate with context data as needed
  classes: CharacterClassEntryContext[];
  conditions: Dnd5eActorCondition[];
  containerPanelItems: ContainerPanelItemContext[];
  creatureType: CreatureTypeContext;
  currencies: CurrencyContext[];
  defenders: Actor5e[];
  enriched: {
    appearance: string;
    bastion: string;
    biography: string;
    bond: string;
    flaw: string;
    ideal: string;
    trait: string;
  };
  epicBoonsEarned: string | undefined;
  facilities: CharacterFacilitiesContext;
  favorites: FavoriteContextEntry[];
  features: TidyItemSectionBase[];
  inspirationSource?: InspirationSource;
  initialSidebarTabId: string;
  inventory: InventorySection[];
  itemContext: Record<string, CharacterItemContext>;
  orphanedSubclasses: Item5e[];
  senses: CharacterSpeedSenseContext;
  showContainerPanel: boolean;
  showDeathSaves: boolean;
  showToken: boolean;
  size: ActorSizeContext;
  skills: ActorSkillsToolsContext<SkillData>[];
  species?: ActorTraitItemContext;
  speeds: CharacterSpeedSenseContext;
  spellbook: SpellbookSection[];
  spellcasting: SpellcastingContext[];
  spellComponentLabels: Record<string, string>;
  spellSlotTrackerMode: string;
  tools: ActorSkillsToolsContext<ToolData>[];
  type: typeof CONSTANTS.SHEET_TYPE_CHARACTER;
} & ActorSheetQuadroneContext<Tidy5eCharacterSheetQuadrone>;

export type NpcSheetQuadroneContext = {
  // TODO: Populate with context data as needed
  conditions: Dnd5eActorCondition[];
  containerPanelItems: ContainerPanelItemContext[];
  currencies: CurrencyContext[];
  enriched: {
    biography: string;
  };
  features: NpcAbilitySection[];
  habitats: { label: string }[];
  inventory: InventorySection[];
  showContainerPanel: boolean;
  showDeathSaves: boolean
  showLairTracker: boolean;
  showLegendaryActions: boolean;
  showLegendaryResistances: boolean;
  showLoyaltyTracker: boolean;
  senses: ActorSpeedSenseEntryContext[];
  size: ActorSizeContext;
  skills: ActorSkillsToolsContext<SkillData>[];
  speeds: ActorSpeedSenseEntryContext[];
  spellbook: SpellbookSection[];
  spellComponentLabels: Record<string, string>;
  spellSlotTrackerMode: string;
  tools: ActorSkillsToolsContext<ToolData>[];
  treasures: { label: string }[];
  type: typeof CONSTANTS.SHEET_TYPE_NPC;
} & ActorSheetQuadroneContext<any>;

export type GroupSheetQuadroneContext = {
  // TODO: Populate with context data as needed
  type: typeof CONSTANTS.SHEET_TYPE_GROUP;
} & ActorSheetQuadroneContext<unknown>;

export type VehicleSheetQuadroneContext = {
  // TODO: Populate with context data as needed
  enriched: {
    biography: string;
  };
  type: typeof CONSTANTS.SHEET_TYPE_VEHICLE;
} & ActorSheetQuadroneContext<unknown>;

/* Misc - Svelte */

export type SvelteInputEvent = (
  event: Event & {
    currentTarget: EventTarget & HTMLInputElement;
  }
) => any;
