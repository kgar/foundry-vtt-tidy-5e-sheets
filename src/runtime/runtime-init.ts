import { ItemFilterRuntime } from './item/ItemFilterRuntime.svelte';
import { ItemSortRuntime } from './item/ItemSortRuntime.svelte';
import { GroupMemberColumnRuntime } from './table-columns/GroupMemberColumnRuntime.svelte';
import { EncounterMemberColumnRuntime } from './table-columns/EncounterMemberColumnRuntime.svelte';
import { TabDocumentItemTypesRuntime } from './item/TabDocumentItemTypesRuntime';
import { VehicleMemberColumnRuntime } from './table-columns/VehicleCrewMemberColumnRuntime';

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
  EncounterMemberColumnRuntime.initOnReady();
  GroupMemberColumnRuntime.initOnReady();
  TabDocumentItemTypesRuntime.initOnReady();
  VehicleMemberColumnRuntime.initOnReady();
}
