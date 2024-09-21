import type { ComponentType, SvelteComponent } from 'svelte';
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
  affectsPlaceholder: string;
  config: typeof CONFIG.DND5E;
  customContent: CustomContent[];
  customEquipmentTypeGroups: RegisteredEquipmentTypeGroup[];
  dimensions:
    | { size: string; width: string | false; height: string | false }
    | undefined;
  durationUnits: GroupableSelectOption[];
  equipmentTypes: GroupableSelectOption[];
  /**
   * Represents remaining health as a percentage within the range of `0` to `100`.
   */
  healthPercentage: number;
  identifiedName: string;
  itemDescriptions: ItemDescription[];
  lockItemQuantity: boolean;
  owner: boolean;
  properties: PropertyContext;
  rangeTypes: GroupableSelectOption[];
  recoveryPeriods: GroupableSelectOption[];
  recoveryTypes: {
    value: string;
    label: string;
  }[];
  scalarTarget: boolean;
  usesRecovery: {
    data: UsesRecoveryData;
    formulaOptions: { label: string; value: string }[] | null;
  }[];
  itemOverrides: Set<string>;
  tabs: Tab[];
} & Record<string, any>;

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
  label: string;
};

export type Item5e = any;

export type ItemChatData = {
  description: { value: string };
  unidentified: { description: string };
  properties: string[];
};

export type ItemCardContentComponent = ComponentType<
  SvelteComponent<
    {
      item: Item5e;
      chatData: ItemChatData;
    },
    any,
    any
  >
>;

export type ContainerItemContext = {
  totalWeight?: number;
  isStack?: boolean;
  favoriteId?: string;
  attunement?: AttunementContext;
  containerContents?: ContainerContents;
};

export type ContainerSheetClassicContext = {
  appId: string;
  capacity: ContainerCapacityContext;
  config: typeof CONFIG.DND5E;
  concealDetails: boolean;
  containerContents: ContainerContents;
  document: Item5e;
  editable: boolean;
  enriched: {
    unidentified: string;
  };
  filterData: DocumentFilters;
  filterPins: Record<string, Set<string>>;
  item: Item5e;
  itemContext: Record<string, ContainerItemContext>;
  itemDescriptions: ItemDescription[];
  itemOverrides: Set<string>;
  itemType: string;
  isIdentified: boolean;
  isPhysical: boolean;
  labels: Record<string, any>;
  lockItemQuantity: boolean;
  lockMoneyChanges: boolean;
  customContent: CustomContent[];
  originalContext: unknown;
  owner: boolean;
  properties: PropertyContext;
  source: any;
  system: any;
  tabs: Tab[];
  utilities: Utilities<ContainerSheetClassicContext>;
};

export type ContainerSection = { items: Item5e[] } & TidySectionBase;

export type ContainerContents = {
  capacity: { max: number; value: number; units: string; pct: number };
  contents: InventorySection[];
  currency: Record<string, number>;
  itemContext: Record<string, ContainerItemContext>;
};
