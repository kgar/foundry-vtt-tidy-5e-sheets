import type { VehicleSheetContext, Tab } from 'src/types/types';
import { derived, writable } from 'svelte/store';
import { CONSTANTS } from 'src/constants';
import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
import VehicleAttributesTab from 'src/sheets/vehicle/VehicleAttributesTab.svelte';
import VehicleCargoAndCrewTab from 'src/sheets/vehicle/VehicleCargoAndCrewTab.svelte';
import VehicleDescriptionTab from 'src/sheets/vehicle/VehicleDescriptionTab.svelte';
import type { SheetTabState, VehicleSheetState } from './types';
import { getOrderedEnabledSheetTabs } from './state-functions';

function getDefaultTabConfigs(): SheetTabState<VehicleSheetContext>[] {
  return [
    {
      id: CONSTANTS.TAB_VEHICLE_ATTRIBUTES,
      displayName: 'DND5E.Attributes',
      content: {
        component: VehicleAttributesTab,
      },
      enabled: true,
      order: 10,
    },
    {
      id: CONSTANTS.TAB_VEHICLE_CARGO_AND_CREW,
      displayName: 'DND5E.VehicleCargoCrew',
      content: {
        component: VehicleCargoAndCrewTab,
      },
      enabled: true,
      order: 20,
    },
    {
      id: CONSTANTS.TAB_NPC_EFFECTS,
      displayName: 'DND5E.Effects',
      content: {
        component: ActorEffectsTab,
      },
      enabled: true,
      order: 30,
    },
    {
      id: CONSTANTS.TAB_VEHICLE_DESCRIPTION,
      displayName: 'DND5E.Description',
      content: {
        component: VehicleDescriptionTab,
      },
      enabled: true,
      order: 40,
    },
  ];
}

let vehicleSheetConfigStore = writable<VehicleSheetState>({
  sheetTabs: getDefaultTabConfigs(),
});

let currentTabs: SheetTabState<VehicleSheetContext>[] = [];

vehicleSheetConfigStore.subscribe((data) => {
  currentTabs = data.sheetTabs;
});

export function getCurrentVehicleTabs(): SheetTabState<VehicleSheetContext>[] {
  return [...currentTabs];
}

export let vehicleSheetTabsStore = derived(vehicleSheetConfigStore, (c) => ({
  getTabs: (context: VehicleSheetContext) =>
    getOrderedEnabledSheetTabs(c.sheetTabs, context),
}));
