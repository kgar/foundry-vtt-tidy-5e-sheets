import { ItemFilterRuntime } from './item/ItemFilterRuntime.svelte';
import { ItemSortRuntime } from './item/ItemSortRuntime.svelte';
import { TabDocumentItemTypesRuntime } from './item/TabDocumentItemTypesRuntime';

/**
 * These runtime features should be initialized at the init hook time in Foundry.
 */
export function initRuntime() {
  ItemFilterRuntime.init();
  ItemSortRuntime.init();
}

/**
 * These runtime features should be initialized at the ready hook time in Foundry.
 */
export function initRuntimeOnReady() {
  // Columns
  TabDocumentItemTypesRuntime.initOnReady();
}
