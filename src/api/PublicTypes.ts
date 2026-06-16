import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
import type { ItemFilterService } from 'src/features/filtering/ItemFilterService.svelte';
import type { Ref } from 'src/features/reactivity/reactivity.types';
import type { ActorSheetContextV1 } from 'src/types/types';
import type { Readable } from 'svelte/store';

/**
 * Helper for type hinting values for subscribers provided by context
 * Note: This isn't a comprehensive list and is subject to change
 */
export type ActorSheetContextRaw = {
  /**
   * Values from the Tidy5e sheet
   */
  context: ActorSheetContextV1;
  /**
   * Location of the tab
   */
  location: string;
  /**
   * id of the current tab
   */
  tabId: string;
  inlineToggleService: InlineToggleService;
  itemFilterService: ItemFilterService;
  /**
   * listener for a tab selected
   */
  onTabSelected(tabId: string): void;
  /**
   * Reference of the element the tab is contained in
   */
  tabContentElementRef: Ref<HTMLDivElement>;
};

/**
 * Helper for type hinting getContext
 * Note: This isn't a comprehensive list and is subject to change
 */
export type ActorSheetContext = {
  [K in keyof ActorSheetContextRaw]: Readable<ActorSheetContextRaw[K]>;
};
