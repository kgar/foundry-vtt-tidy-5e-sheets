import type { ComponentType, SvelteComponent } from 'svelte';
import type {
  AttunementContext,
  CustomContent,
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
import type { CurrentSettings } from 'src/settings/settings';

export type ItemSheetContext = {
  activateEditors: (
    node: HTMLElement,
    options?: { bindSecrets?: boolean }
  ) => void;
  customContent: CustomContent[];
  customEquipmentTypeGroups: RegisteredEquipmentTypeGroup[];
  /**
   * Represents remaining health as a percentage within the range of `0` to `100`.
   */
  healthPercentage: number;
  identifiedName: string;
  itemDescriptions: ItemDescription[];
  lockItemQuantity: boolean;
  originalContext: unknown;
  owner: boolean;
  itemOverrides: Set<string>;
  settings: CurrentSettings;
  tabs: Tab[];
  viewableWarnings: DocumentPreparationWarning[];
} & Record<string, any>;

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

export type ContainerSheetContext = {
  activateEditors: (
    node: HTMLElement,
    options?: { bindSecrets?: boolean }
  ) => void;
  appId: string;
  containerContents: ContainerContents;
  filterData: DocumentFilters;
  itemContext: Record<string, ContainerItemContext>;
  itemDescriptions: ItemDescription[];
  itemOverrides: Set<string>;
  lockItemQuantity: boolean;
  customContent: CustomContent[];
  originalContext: unknown;
  owner: boolean;
  settings: CurrentSettings;
  tabs: Tab[];
  utilities: Utilities<ContainerSheetContext>;
  viewableWarnings: DocumentPreparationWarning[];
} & Record<string, any>;

export type ContainerSection = { items: Item5e[] } & TidySectionBase;

export type ContainerContents = {
  capacity: { max: number; value: number; units: string; pct: number };
  contents: InventorySection[];
  currency: Record<string, number>;
  itemContext: Record<string, ContainerItemContext>;
};
