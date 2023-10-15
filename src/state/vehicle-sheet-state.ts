import type { VehicleSheetContext, Tab } from 'src/types/types';
import { derived, get, writable } from 'svelte/store';
import { CONSTANTS } from 'src/constants';
import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
import VehicleAttributesTab from 'src/sheets/vehicle/VehicleAttributesTab.svelte';
import VehicleCargoAndCrewTab from 'src/sheets/vehicle/VehicleCargoAndCrewTab.svelte';
import VehicleDescriptionTab from 'src/sheets/vehicle/VehicleDescriptionTab.svelte';
import type { SheetTabRegistrationOptions, SheetTabState, VehicleSheetState } from './types';
import { getOrderedEnabledSheetTabs } from './state-functions';
import { warn } from 'src/utils/logging';

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

let vehicleSheetState = writable<VehicleSheetState>({
  sheetTabs: getDefaultTabConfigs(),
});

export function getCurrentVehicleTabs(): SheetTabState<VehicleSheetContext>[] {
  return [...get(vehicleSheetState).sheetTabs];
}

export let vehicleSheetTabsStore = derived(vehicleSheetState, (c) => ({
  getTabs: (context: VehicleSheetContext) =>
    getOrderedEnabledSheetTabs(c.sheetTabs, context),
}));

export function registerVehicleTab(
  tab: SheetTabState<VehicleSheetContext>,
  options?: SheetTabRegistrationOptions
) {
  const tabExists = getCurrentVehicleTabs().some((t) => t.id === tab.id);

  if (tabExists && !options?.overwrite) {
    warn(
      `Tab with id ${tab.id} already exists. Use option "overwrite" to replace an existing tab.`
    );
  }

  vehicleSheetState.update((state) => {
    state.sheetTabs.push(tab);
    state.sheetTabs.sort((a, b) => a.order - b.order);
    return state;
  });

  return getCurrentVehicleTabs();
}

export function unregisterTab(tabId: string) {
  vehicleSheetState.update((state) => {
    state.sheetTabs = [...state.sheetTabs.filter((t) => t.id !== tabId)];
    return state;
  });
}