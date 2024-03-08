import type { ComponentType, SvelteComponent } from 'svelte';
import type { CustomContent, Tab } from './types';
import type { DocumentPreparationWarning } from './types';
import type { RegisteredEquipmentTypeGroup } from 'src/runtime/item/item.types';

export type ItemSheetContext = {
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

export type ContainerSheetContext = {
  appId: string;
  activateFoundryJQueryListeners: (node: HTMLElement) => void;
  itemDescriptions: ItemDescription[];
  lockItemQuantity: boolean;
  customContent: CustomContent[];
  originalContext: unknown;
  owner: boolean;
  tabs: Tab[];
  viewableWarnings: DocumentPreparationWarning[];
} & Record<string, any>;
