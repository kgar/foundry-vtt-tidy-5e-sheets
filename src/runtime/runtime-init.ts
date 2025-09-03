import { ItemFilterRuntime } from './item/ItemFilterRuntime.svelte';
import { ItemSortRuntime } from './item/ItemSortRuntime.svelte';
import { ActivityColumnRuntime } from './tables/ActivityColumnRuntime.svelte';
import { EffectColumnRuntime } from './tables/EffectColumnRuntime.svelte';
import { GroupMemberColumnRuntime } from './tables/GroupMemberColumnRuntime.svelte';
import { ItemColumnRuntime } from './tables/ItemColumnRuntime.svelte';

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
  ItemColumnRuntime.initOnReady();
  ActivityColumnRuntime.initOnReady();
  EffectColumnRuntime.initOnReady();
  GroupMemberColumnRuntime.initOnReady();
}
