import type { ComponentType, SvelteComponent } from 'svelte';

export type ItemSheetContext = {
  lockItemQuantity: boolean;
  owner: boolean;
  /**
   * Represents remaining health as a percentage within the range of `0` to `100`.
   */
  healthPercentage: number;
} & Record<string, any>;

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