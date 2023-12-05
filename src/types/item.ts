import type { RegisterItemDetailsSectionOptions } from 'src/api/api.types';
import type { ComponentType, SvelteComponent } from 'svelte';

export type ItemSheetContext = {
  customDetailSections: CustomItemSection[];
  /**
   * Represents remaining health as a percentage within the range of `0` to `100`.
   */
  healthPercentage: number;
  itemDescriptions: ItemDescription[];
  lockItemQuantity: boolean;
  originalContext: unknown;
  owner: boolean;
} & Record<string, any>;

export type ItemDescription = {
  field: string;
  content: string;
  label: string;
};

export type Item5e = any;

export type ItemChatData = {
  description: { value: string };
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

export type CustomItemSection = {
  sectionTitleHtml?: string;
  contentHtml: string;
  options: RegisterItemDetailsSectionOptions;
}