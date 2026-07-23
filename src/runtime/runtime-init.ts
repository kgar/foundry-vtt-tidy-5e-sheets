import { ItemFilterRuntime } from './item/ItemFilterRuntime.svelte';
import { ItemSortRuntime } from './item/ItemSortRuntime.svelte';
import { ActivityColumnRuntime } from './table-columns/ActivityColumnRuntime.svelte';
import { EffectColumnRuntime } from './table-columns/EffectColumnRuntime.svelte';
import { GroupMemberColumnRuntime } from './table-columns/GroupMemberColumnRuntime.svelte';
import { EncounterMemberColumnRuntime } from './table-columns/EncounterMemberColumnRuntime.svelte';
import { ItemColumnRuntime } from './table-columns/ItemColumnRuntime.svelte';
import { TabDocumentItemTypesRuntime } from './item/TabDocumentItemTypesRuntime';
import { VehicleMemberColumnRuntime } from './table-columns/VehicleCrewMemberColumnRuntime';
import { AdvancementColumnRuntime } from './table-columns/AdvancementColumnRuntime.svelte';

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
  EffectColumnRuntime.initOnReady();
  EncounterMemberColumnRuntime.initOnReady();
  GroupMemberColumnRuntime.initOnReady();
  ItemColumnRuntime.initOnReady();
  TabDocumentItemTypesRuntime.initOnReady();
  VehicleMemberColumnRuntime.initOnReady();
}
