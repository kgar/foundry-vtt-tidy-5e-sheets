import type { UserPreferences } from 'src/features/user-preferences/user-preferences.types';
import type {
  ActivityItemContext,
  AttunementContext,
  ContainerCapacityContext,
  CustomContent,
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
import type { SortParametersQuadrone } from './sort.types';

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
};

export type ItemNameContext = {
  value: string;
  editable: string;
  field: unknown;
};

export type ItemSheetQuadroneContext = {
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
  labels: Record<string, string>;
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
    value: string;
    label: string;
  }[];
  rollData: Record<string, any>;
  scalarTarget: boolean;
  source: any;
  subtitle?: string;
  system: any;
  title: string;
  toggleAdvancementLock: () => Promise<void>;
  unlocked: boolean;
  user: any;
  usesRecovery: {
    data: UsesRecoveryData;
    formulaOptions: { label: string; value: string }[] | null;
  }[];
  itemOverrides: Set<string>;
  tabs: Tab[];
};

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

export type ItemChatData = {
  description: { value: string };
  unidentified: { description: string };
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
};

export type CurrencyContext = {
  key: string;
  value: number;
  abbr: string;
};

export type ContainerSheetQuadroneContext = {
  capacity: ContainerCapacityContext;
  config: typeof CONFIG.DND5E;
  concealDetails: boolean;
  containerContents: ContainerContents;
  currencies: CurrencyContext[];
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
  name: ItemNameContext;
  customContent: CustomContent[];
  owner: boolean;
  properties: PropertyContext;
  rollData: Record<string, any>;
  contentsSort: SortParametersQuadrone;
  source: any;
  system: any;
  tabs: Tab[];
  unlocked: boolean;
  userPreferences: UserPreferences;
};

export type ContainerSection = { items: Item5e[] } & TidySectionBase;

export type ContainerContents = {
  capacity: { max: number; value: number; units: string; pct: number };
  contents: InventorySection[];
  currency: Record<string, number>;
  itemContext: Record<string, ContainerItemContext>;
};
