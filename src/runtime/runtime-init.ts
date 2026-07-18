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
import { InventoryRowActionRuntime } from './table-row-actions/InventoryRowActionRuntime.svelte';
import { FeatureRowActionRuntime } from './table-row-actions/FeatureRowActionRuntime.svelte';
import { SpellRowActionRuntime } from './table-row-actions/SpellRowActionRuntime.svelte';
import { ContainerContentsRowActionRuntime } from './table-row-actions/ContainerContentsRowActionRuntime.svelte';

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
  AdvancementColumnRuntime.initOnReady();
  EffectColumnRuntime.initOnReady();
  EncounterMemberColumnRuntime.initOnReady();
  GroupMemberColumnRuntime.initOnReady();
  ItemColumnRuntime.initOnReady();
  TabDocumentItemTypesRuntime.initOnReady();
  VehicleMemberColumnRuntime.initOnReady();
  ContainerContentsRowActionRuntime.initOnReady();
  FeatureRowActionRuntime.initOnReady();
  InventoryRowActionRuntime.initOnReady();
  SpellRowActionRuntime.initOnReady();
}
