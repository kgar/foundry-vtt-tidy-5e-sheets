import { ItemFilterRuntime } from './item/ItemFilterRuntime.svelte';
import { ItemSortRuntime } from './item/ItemSortRuntime.svelte';

export function initRuntime() {
  ItemFilterRuntime.init();
  ItemSortRuntime.init();
}
