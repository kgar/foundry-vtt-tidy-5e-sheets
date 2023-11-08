import type { VehicleSheetContext, Tab } from 'src/types/types';
import { derived, get, writable } from 'svelte/store';
import { CONSTANTS } from 'src/constants';
import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
import VehicleAttributesTab from 'src/sheets/vehicle/tabs/VehicleAttributesTab.svelte';
import VehicleCargoAndCrewTab from 'src/sheets/vehicle/tabs/VehicleCargoAndCrewTab.svelte';
import VehicleDescriptionTab from 'src/sheets/vehicle/tabs/VehicleDescriptionTab.svelte';
import type {
  SheetTabRegistrationOptions,
  SheetTabState,
  VehicleSheetState,
} from './types';
import { getOrderedEnabledSheetTabs } from './state-functions';
import { warn } from 'src/utils/logging';

let vehicleSheetState = writable<VehicleSheetState>({
  sheetTabs: [
    {
      id: CONSTANTS.TAB_VEHICLE_ATTRIBUTES,
      displayName: 'DND5E.Attributes',
      content: {
        component: VehicleAttributesTab,
      },
      enabled: true,
      order: 10,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_VEHICLE_CARGO_AND_CREW,
      displayName: 'DND5E.VehicleCargoCrew',
      content: {
        component: VehicleCargoAndCrewTab,
      },
      enabled: true,
      order: 20,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_NPC_EFFECTS,
      displayName: 'DND5E.Effects',
      content: {
        component: ActorEffectsTab,
      },
      enabled: true,
      order: 30,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_VEHICLE_DESCRIPTION,
      displayName: 'DND5E.Description',
      content: {
        component: VehicleDescriptionTab,
      },
      enabled: true,
      order: 40,
      layout: 'classic',
    },
  ],
});

export function getAllRegisteredVehicleSheetTabs(): SheetTabState<VehicleSheetContext>[] {
  return [...get(vehicleSheetState).sheetTabs];
}

export let currentVehicleSheetTabs = derived(vehicleSheetState, (c) => ({
  getTabs: (context: VehicleSheetContext) =>
    getOrderedEnabledSheetTabs(c.sheetTabs, context),
}));

export function registerVehicleSheetTab(
  tab: SheetTabState<VehicleSheetContext>,
  options?: SheetTabRegistrationOptions
) {
  const tabExists = getAllRegisteredVehicleSheetTabs().some(
    (t) => t.id === tab.id
  );

  if (tabExists && !options?.overwrite) {
    warn(
      `Tab with id ${tab.id} already exists. Use option "overwrite" to replace an existing tab.`
    );
    return;
  }

  vehicleSheetState.update((state) => {
    state.sheetTabs.push(tab);
    state.sheetTabs.sort((a, b) => a.order - b.order);
    return state;
  });

  return getAllRegisteredVehicleSheetTabs();
}

export function unregisterVehicleSheetTab(tabId: string) {
  vehicleSheetState.update((state) => {
    state.sheetTabs = [...state.sheetTabs.filter((t) => t.id !== tabId)];
    return state;
  });
}
