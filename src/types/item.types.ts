import type { Component } from 'svelte';
import type {
  AttunementContext,
  ContainerCapacityContext,
  CustomContent,
  GroupableSelectOption,
  InventorySection,
  Tab,
  TidySectionBase,
  Utilities,
} from './types';
import type { DocumentPreparationWarning } from './types';
import type {
  DocumentFilters,
  RegisteredEquipmentTypeGroup,
} from 'src/runtime/item/item.types';
import type { CONFIG } from 'src/foundry/config.types';

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
  itemSubtypes: Record<string, string>;
  labels: Record<string, string>;
  limited: boolean;
  lockItemQuantity: boolean;
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
  totalWeight?: number;
  isStack?: boolean;
  favoriteId?: string;
  attunement?: AttunementContext;
  containerContents?: ContainerContents;
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
  customContent: CustomContent[];
  owner: boolean;
  properties: PropertyContext;
  rollData: Record<string, any>;
  source: any;
  system: any;
  tabs: Tab[];
  utilities: Utilities<ContainerSheetClassicContext>;
};

export type ContainerSheetHightouchContext = {
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
  customContent: CustomContent[];
  owner: boolean;
  properties: PropertyContext;
  rollData: Record<string, any>;
  source: any;
  system: any;
  tabs: Tab[];
  unlocked: boolean;
  utilities: Utilities<ContainerSheetHightouchContext>;
};

export type ContainerSection = { items: Item5e[] } & TidySectionBase;

export type ContainerContents = {
  capacity: { max: number; value: number; units: string; pct: number };
  contents: InventorySection[];
  currency: Record<string, number>;
  itemContext: Record<string, ContainerItemContext>;
};
