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
import { EffectRowActionRuntime } from './table-row-actions/EffectRowActionRuntime.svelte';
import { ActivityRowActionRuntime } from './table-row-actions/ActivityRowActionRuntime.svelte';
import { GroupMemberRowActionRuntime } from './table-row-actions/GroupMemberRowActionRuntime.svelte';
import { EncounterMemberRowActionRuntime } from './table-row-actions/EncounterMemberRowActions.svelte';
import { DraftAnimalMemberRowActionRuntime } from './table-row-actions/DraftAnimalRowActions.svelte';
import { UnassignedCrewMemberRowActionRuntime } from './table-row-actions/UnassignedCrewRowActionRuntime.svelte';
import { PassengerMemberRowActionRuntime } from './table-row-actions/PassengerRowActionRuntime.svelte';
import { AssignedCrewMemberRowActionRuntime } from './table-row-actions/AssignedCrewRowActionRuntime.svelte';
import { EncounterCombatMemberRowActionRuntime } from './table-row-actions/EncounterCombatRowActionRuntime.svelte';

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
  ActivityColumnRuntime.initOnReady();
  AdvancementColumnRuntime.initOnReady();
  EffectColumnRuntime.initOnReady();
  EncounterMemberColumnRuntime.initOnReady();
  GroupMemberColumnRuntime.initOnReady();
  ItemColumnRuntime.initOnReady();
  TabDocumentItemTypesRuntime.initOnReady();
  VehicleMemberColumnRuntime.initOnReady();

  // Row Actions
  ActivityRowActionRuntime.initOnReady();
  AssignedCrewMemberRowActionRuntime.initOnReady();
  ContainerContentsRowActionRuntime.initOnReady();
  DraftAnimalMemberRowActionRuntime.initOnReady();
  EffectRowActionRuntime.initOnReady();
  EncounterCombatMemberRowActionRuntime.initOnReady();
  EncounterMemberRowActionRuntime.initOnReady();
  FeatureRowActionRuntime.initOnReady();
  GroupMemberRowActionRuntime.initOnReady();
  InventoryRowActionRuntime.initOnReady();
  PassengerMemberRowActionRuntime.initOnReady();
  SpellRowActionRuntime.initOnReady();
  UnassignedCrewMemberRowActionRuntime.initOnReady();
}
