import type { VehicleSheetContext, Tab } from 'src/types/types';
import { derived, writable } from 'svelte/store';
import { CONSTANTS } from 'src/constants';
import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
import VehicleAttributesTab from 'src/sheets/vehicle/VehicleAttributesTab.svelte';
import VehicleCargoAndCrewTab from 'src/sheets/vehicle/VehicleCargoAndCrewTab.svelte';
import VehicleDescriptionTab from 'src/sheets/vehicle/VehicleDescriptionTab.svelte';

type SheetTabRuntimeConfig<TContext> = Tab & {
  enabled: boolean | ((context: TContext) => boolean);
  order: number;
};

type VehicleSheetRuntimeConfig = {
  sheetTabs: SheetTabRuntimeConfig<VehicleSheetContext>[];
};

function getDefaultTabConfigs(): SheetTabRuntimeConfig<VehicleSheetContext>[] {
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

let vehicleSheetConfigStore = writable<VehicleSheetRuntimeConfig>({
  sheetTabs: getDefaultTabConfigs(),
});

export let vehicleSheetTabsStore = derived(vehicleSheetConfigStore, (c) => ({
  getTabs: (context: VehicleSheetContext) =>
    [...c.sheetTabs]
      .filter(
        (t) =>
          t.enabled === true ||
          (typeof t.enabled === 'function' && t.enabled(context))
      )
      .sort((a, b) => a.order - b.order),
}));
