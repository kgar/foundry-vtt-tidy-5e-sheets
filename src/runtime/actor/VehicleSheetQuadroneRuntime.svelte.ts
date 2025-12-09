import { ActorSheetQuadroneRuntime } from '../ActorSheetQuadroneRuntime.svelte';
import type { VehicleSheetQuadroneContext } from 'src/types/types';
import ActorEffectsTab from 'src/sheets/quadrone/actor/tabs/ActorEffectsTab.svelte';
import VehicleStatblockTab from 'src/sheets/quadrone/actor/tabs/VehicleStatblockTab.svelte';
import VehicleCargoTab from 'src/sheets/quadrone/actor/tabs/VehicleCargoTab.svelte';
import VehicleCrewAndPassengersTab from 'src/sheets/quadrone/actor/tabs/VehicleCrewAndPassengersTab.svelte';
import VehicleDescriptionTab from 'src/sheets/quadrone/actor/tabs/VehicleDescriptionTab.svelte';
import { CONSTANTS } from 'src/constants';

export const VehicleSheetQuadroneRuntime =
  new ActorSheetQuadroneRuntime<VehicleSheetQuadroneContext>(
    [
      {
        id: CONSTANTS.TAB_STATBLOCK,
        title: 'TIDY5E.StatblockTabName',
        content: {
          component: VehicleStatblockTab,
          type: 'svelte',
        },
        layout: 'quadrone',
        iconClass: 'fa-solid fa-wreath-laurel',
      },
      {
        id: CONSTANTS.TAB_ACTOR_INVENTORY,
        title: 'DND5E.VEHICLE.Tabs.Cargo',
        content: {
          component: VehicleCargoTab,
          type: 'svelte',
        },
        layout: 'quadrone',
        iconClass: 'fa-solid fa-boxes-packing',
      },
      {
        id: CONSTANTS.TAB_VEHICLE_CREW_AND_PASSENGERS,
        title: 'DND5E.VEHICLE.Tabs.CrewPassengers',
        content: {
          component: VehicleCrewAndPassengersTab,
          type: 'svelte',
        },
        layout: 'quadrone',
        iconClass: 'fa-solid fa-poo-storm',
      },
      {
        id: CONSTANTS.TAB_EFFECTS,
        title: 'DND5E.Effects',
        content: {
          component: ActorEffectsTab,
          type: 'svelte',
        },
        layout: 'quadrone',
        iconClass: 'fa-solid fa-bolt',
      },
      {
        id: CONSTANTS.TAB_DESCRIPTION,
        title: 'DND5E.Description',
        content: {
          component: VehicleDescriptionTab,
          type: 'svelte',
        },
        layout: 'quadrone',
        iconClass: 'fa-solid fa-feather',
      },
    ],
    [
      CONSTANTS.TAB_STATBLOCK,
      CONSTANTS.TAB_VEHICLE_CREW_AND_PASSENGERS,
      CONSTANTS.TAB_ACTOR_INVENTORY,
      CONSTANTS.TAB_EFFECTS,
      CONSTANTS.TAB_DESCRIPTION,
    ]
  );
