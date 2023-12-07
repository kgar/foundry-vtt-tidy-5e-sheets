import type { OnRenderArgs, RegisterItemDetailsSectionOptions } from 'src/api/api.types';
import type { ComponentType, SvelteComponent } from 'svelte';

export type ItemSheetContext = {
  customDetailSections: CustomHtmlItemSection[];
  customTabs: CustomTab[];
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

export type CustomHtmlItemSection = {
  sectionTitleHtml?: string;
  contentHtml: string;
  options: RegisterItemDetailsSectionOptions;
};

export type CustomTabBase = {
  onRender?: (args: OnRenderArgs & { tabContentsElement: HTMLElement }) => void;
}

export type CustomTab = CustomHtmlTab & CustomTabBase; // & others as time goes on

export type CustomHtmlTab = {
  type: 'html';
  title: string;
  tabId: string;
  tabClasses: string[];
  contentHtml: string;
  tabContentsClasses: string[];
};
