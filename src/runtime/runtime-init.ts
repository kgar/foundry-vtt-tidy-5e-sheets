import { ItemFilterRuntime } from './item/ItemFilterRuntime.svelte';
import { ItemSortRuntime } from './item/ItemSortRuntime.svelte';
import { ActivityColumnRuntime } from './tables/ActivityColumnRuntime.svelte';
import { EffectColumnRuntime } from './tables/EffectColumnRuntime.svelte';
import { GroupMemberColumnRuntime } from './tables/GroupMemberColumnRuntime.svelte';
import { EncounterMemberColumnRuntime } from './tables/EncounterMemberColumnRuntime.svelte';
import { ItemColumnRuntime } from './tables/ItemColumnRuntime.svelte';
import { TabDocumentItemTypesRuntime } from './item/TabDocumentItemTypesRuntime';
import { VehicleMemberColumnRuntime } from './tables/VehicleCrewMemberColumnRuntime';

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
  ActivityColumnRuntime.initOnReady();
  VehicleMemberColumnRuntime.initOnReady();
  EffectColumnRuntime.initOnReady();
  EncounterMemberColumnRuntime.initOnReady();
  GroupMemberColumnRuntime.initOnReady();
  ItemColumnRuntime.initOnReady();
  TabDocumentItemTypesRuntime.initOnReady();
}
