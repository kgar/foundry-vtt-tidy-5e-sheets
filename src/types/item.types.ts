import type { UserPreferences } from 'src/features/user-preferences/user-preferences.types';
import type {
  ActiveEffectContext,
  ActivityItemContext,
  AttunementContext,
  ContainerCapacityContext,
  CustomContent,
  DocumentSheetV2Context,
  EffectCategory,
  GroupableSelectOption,
  InventorySection,
  Tab,
  TidySectionBase,
  Utilities,
} from './types';
import type {
  DocumentFilters,
  RegisteredEquipmentTypeGroup,
} from 'src/runtime/item/item.types';

export type PropertyContext = {
  active: string[];
  object: Record<string, true>;
  options: {
    label: string;
    selected: boolean;
    value: string;
  }[];
};

export type ItemFacilityOrdersContext = {
  available: {
    value: string;
    label: string;
  }[];
  executable: {
    value: string;
    label: string;
  }[];
};

export type ItemSheetContext = {
  activities: {
    id: string;
    uuid: string;
    name: string;
    sort: number;
    img: {
      src: string;
      svg: boolean;
    };
  }[];
  activationTypes: GroupableSelectOption[];
  advancement: any;
  advancementEditable: boolean;
  affectsPlaceholder: string;
  baseItems: Record<string, string>;
  canCraft?: boolean;
  concealDetails: boolean;
  config: typeof CONFIG.DND5E;
  coverOptions: { value: string; label: string }[];
  craft?: {
    img: string;
    name: string;
    contentLink: string;
  };
  customContent: CustomContent[];
  customEquipmentTypeGroups: RegisteredEquipmentTypeGroup[];
  data: any;
  damageTypes:
    | { label: string; value: string; selected: boolean }[]
    | undefined;
  defaultAbility: string;
  denominationOptions: any;
  dimensions:
    | { size: string; width: string | false; height: string | false }
    | undefined;
  document: any;
  durationUnits: GroupableSelectOption[];
  editable: boolean;
  effects: any;
  enriched: {
    description: string;
    unidentified: string;
    chat: string;
  };
  equipmentTypes: GroupableSelectOption[];
  facilitySubtypes?: Record<string, string>;
  hasDexModifier: boolean;
  /**
   * Represents remaining health as a percentage within the range of `0` to `100`.
   */
  healthPercentage: number;
  identifiedName: string;
  isEmbedded: boolean;
  isHarvesting?: boolean;
  isIdentifiable: boolean;
  isIdentified: boolean;
  isPhysical: boolean;
  item: Item5e;
  itemDescriptions: ItemDescription[];
  itemType: string;
  itemStatus: string | null;
  itemSubtypes?: Record<string, string>;
  // TODO: Possibly apply typings here. If it's not feasible, we're better off not wasting time trying to chase after every item's specific labels in TS typings.
  labels: Record<string, any>;
  limited: boolean;
  lockItemQuantity: boolean;
  modernRules: boolean;
  options: any;
  orders?: ItemFacilityOrdersContext;
  owner: boolean;
  properties: PropertyContext;
  rangeTypes: GroupableSelectOption[];
  recoveryPeriods: GroupableSelectOption[];
  recoveryTypes: {
    value: string;
    label: string;
  }[];
  rollData: Record<string, any>;
  scalarTarget: boolean;
  source: any;
  spellcastingMethods: {
    label: string;
    value: string;
  }[];
  system: any;
  title: string;
  toggleAdvancementLock: () => Promise<void>;
  user: any;
  usesRecovery: {
    data: UsesRecoveryData;
    formulaOptions: { label: string; value: string }[] | null;
  }[];
  itemOverrides: Set<string>;
  tabs: Tab[];
} & DocumentSheetV2Context;

export type ItemNameContext = {
  value: string;
  editable: string;
  field: unknown;
};

export type ActivityQuadroneContext = {
  id: string;
  uuid: string;
  name: string;
  sort: number;
  img: {
    src: string;
    svg: boolean;
  };
  doc: any;
};

export type ItemSheetQuadroneContext = {
  activities: ActivityQuadroneContext[];
  activationTypes: GroupableSelectOption[];
  advancement: AdvancementsContext;
  affectsPlaceholder: string;
  baseItems: Record<string, string>;
  canCraft?: boolean;
  canPrepare?: boolean;
  concealDetails: boolean;
  config: typeof CONFIG.DND5E;
  coverOptions: { value: string; label: string }[];
  craft?: {
    img: string;
    name: string;
    contentLink: string;
  };
  currentTabId: string;
  customContent: CustomContent[];
  customEquipmentTypeGroups: RegisteredEquipmentTypeGroup[];
  data: any;
  damageTypes:
    | { label: string; value: string; selected: boolean }[]
    | undefined;
  defaultAbility: string;
  denominationOptions: any;
  dimensions:
    | { size: string; width: string | false; height: string | false }
    | undefined;
  document: any;
  durationUnits: GroupableSelectOption[];
  editable: boolean;
  effects: Record<string, EffectCategory<ActiveEffectContext>>;
  enriched: {
    description: string;
    unidentified: string;
    chat: string;
  };
  equipmentTypes: GroupableSelectOption[];
  facilitySubtypes?: Record<string, string>;
  hasDexModifier: boolean;
  /**
   * Represents remaining health as a percentage within the range of `0` to `100`.
   */
  healthPercentage: number;
  identifiedName: string;
  isEmbedded: boolean;
  isHarvesting?: boolean;
  isIdentifiable: boolean;
  isIdentified: boolean;
  isPhysical: boolean;
  item: Item5e;
  itemDescriptions: ItemDescription[];
  itemType: string;
  itemStatus: string | null;
  itemSubtypes?: Record<string, string>;
  labels: Record<string, string> & {
    components: {
      all: { abbr: string }[];
      vsm: string;
      tags: unknown[];
    };
  };
  limited: boolean;
  lockItemQuantity: boolean;
  modernRules: boolean;
  options: any;
  name: ItemNameContext;
  orders?: ItemFacilityOrdersContext;
  owner: boolean;
  primaryAbilities?: { value: string; label: string; selected: boolean }[];
  properties: PropertyContext;
  rangeTypes: GroupableSelectOption[];
  recoveryPeriods: GroupableSelectOption[];
  recoveryTypes: {
    label: string;
    value: string;
  }[];
  rollData: Record<string, any>;
  scalarTarget: boolean;
  source: any;
  spellcastingMethods: {
    label: string;
    value: string;
  }[];
  subtitle?: string;
  system: any;
  title: string;
  unlocked: boolean;
  user: any;
  usesRecovery: {
    data: UsesRecoveryData;
    formulaOptions: { label: string; value: string }[] | null;
  }[];
  tabs: Tab[];
} & DocumentSheetV2Context;

/**
 * Data for a recovery profile for an activity's uses.
 */
export interface UsesRecoveryData {
  period: string;
  type: string;
  formula: string;
  recharge?: {
    options?: {
      label: string;
      value: string;
    }[];
  };
}

/**
 * Field for storing uses data.
 */
export interface UsesField {
  spent: number;
  max: string;
  recovery: UsesRecoveryData[];
}

export type ItemDescription = {
  field: string;
  content: string;
  enriched: string;
  label: string;
};

export type Item5e = any;
export type Advancement5e = any;

export type ItemChatData = {
  description: { value: string };
  properties: string[];
};

export type ContainerItemContext = {
  activities?: ActivityItemContext[];
  attunement?: AttunementContext;
  containerContents?: ContainerContents;
  favoriteId?: string;
  isStack?: boolean;
  totalWeight?: number;
};

export type ContainerSheetClassicContext = {
  capacity: ContainerCapacityContext;
  config: typeof CONFIG.DND5E;
  concealDetails: boolean;
  containerContents: ContainerContents;
  document: Item5e;
  editable: boolean;
  enriched: {
    description: string;
    unidentified: string;
    chat: string;
  };
  filterData: DocumentFilters;
  filterPins: Record<string, Set<string>>;
  item: Item5e;
  identifiedName: string;
  items: Item5e[];
  itemContext: Record<string, ContainerItemContext>;
  itemDescriptions: ItemDescription[];
  itemOverrides: Set<string>;
  itemType: string;
  isContainer: true;
  isIdentifiable: boolean;
  isIdentified: boolean;
  isPhysical: boolean;
  labels: Record<string, any>;
  lockItemQuantity: boolean;
  lockMoneyChanges: boolean;
  modernRules: boolean;
  customContent: CustomContent[];
  owner: boolean;
  properties: PropertyContext;
  rollData: Record<string, any>;
  source: any;
  system: any;
  tabs: Tab[];
  utilities: Utilities<ContainerSheetClassicContext>;
} & DocumentSheetV2Context;

export type CurrencyContext = {
  key: string;
  value: number;
  abbr: string;
};

export type ContainerSheetQuadroneContext = {
  capacity: ContainerCapacityContext;
  concealDetails: boolean;
  config: typeof CONFIG.DND5E;
  containerContents: ContainerContents;
  currencies: CurrencyContext[];
  customContent: CustomContent[];
  currentTabId: string;
  document: Item5e;
  editable: boolean;
  enriched: {
    description: string;
    unidentified: string;
    chat: string;
  };
  filterData: DocumentFilters;
  filterPins: Record<string, Set<string>>;
  identifiedName: string;
  isContainer: true;
  isIdentifiable: boolean;
  isIdentified: boolean;
  isPhysical: boolean;
  item: Item5e;
  itemContext: Record<string, ContainerItemContext>;
  itemDescriptions: ItemDescription[];
  items: Item5e[];
  itemType: string;
  labels: Record<string, any>;
  lockItemQuantity: boolean;
  lockMoneyChanges: boolean;
  modernRules: boolean;
  name: ItemNameContext;
  owner: boolean;
  properties: PropertyContext;
  rollData: Record<string, any>;
  source: any;
  system: any;
  tabs: Tab[];
  unlocked: boolean;
  userPreferences: UserPreferences;
} & DocumentSheetV2Context;

export type ContainerSection = { items: Item5e[] } & TidySectionBase;

export type ContainerContents = {
  capacity: { max: number; value: number; units: string; pct: number };
  contents: InventorySection[];
  currency: Record<string, number>;
  itemContext: Record<string, ContainerItemContext>;
};

export type AdvancementsContext = {
  [level: string]: AdvancementSectionContext;
};

export type AdvancementSectionContext = {
  items: AdvancementItemContext[];
  configured: 'partial' | 'full' | false;
};

export type AdvancementItemContext = {
  /** The ID of the advancement. */
  id: string;
  /** An string-based ordering property. Used with a localized sort. */
  order: string;
  /** HTML: the name / label of the advancement. */
  title: string;
  /** The path to an image or SVG. */
  icon: string;
  /** HTML to include on a summary line below the advancement name. */
  summary: string;
  /** Denotes a class restriction. Unused here. */
  classRestriction: string;
  /**
   * Denotes whether this advancement has been configured
   * for the level with which it is associated.
   */
  configured: boolean;
  /**
   * Extra contextual information, presented often as an icon
   * with a tooltip; e.g., "Multiclass Only" with multiple helmets icon
   */
  tags: {
    /** Explains the icon; often used as a tooltip. */
    label: string;
    /** The path to the font icon class. */
    iconClass: string;
  }[];
  /**
   * A subclass of ScaleValueType.
   * For our purposes, this is a means to call `.toString()`.
   */
  value: { toString(): string };
  /**
   * Any CSS classes that should be added to a given row.
   * In svelte, we would do this in the component.
   */
  classes: string;
};

export type MovementInfo = {
  label: string;
  value: number | string;
  unit: string;
};
export type SenseInfo = { label: string; value: number | string; unit: string };
