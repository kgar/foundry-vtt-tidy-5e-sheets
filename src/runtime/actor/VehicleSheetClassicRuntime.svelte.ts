import { ActorSheetRuntime } from '../ActorSheetRuntime.svelte';
import type { VehicleSheetContext } from 'src/types/types';
import ActorEffectsTab from 'src/sheets/classic/actor/ActorEffectsTab.svelte';
import VehicleAttributesTab from 'src/sheets/classic/vehicle/tabs/VehicleAttributesTab.svelte';
import VehicleDescriptionTab from 'src/sheets/classic/vehicle/tabs/VehicleDescriptionTab.svelte';
import ActorActionsTab from 'src/sheets/classic/actor/tabs/ActorActionsTab.svelte';
import type { RegisteredTab } from '../types';
import { CONSTANTS } from 'src/constants';
import VehiclePassengersAndCrewTab from 'src/sheets/classic/vehicle/tabs/VehiclePassengersAndCrewTab.svelte';
import VehicleCargoTab from 'src/sheets/classic/vehicle/tabs/VehicleCargoTab.svelte';

const defaultVehicleClassicTabs: RegisteredTab<VehicleSheetContext>[] = [
  {
    title: 'TIDY5E.Actions.TabName',
    content: {
      component: ActorActionsTab,
      type: 'svelte',
    },
    id: CONSTANTS.TAB_ACTOR_ACTIONS,
    layout: 'classic',
  },
  {
    id: CONSTANTS.TAB_VEHICLE_ATTRIBUTES,
    title: 'DND5E.Attributes',
    content: {
      component: VehicleAttributesTab,
      type: 'svelte',
    },
    layout: 'classic',
  },
  {
    id: CONSTANTS.TAB_VEHICLE_CREW_AND_PASSENGERS,
    title: 'DND5E.VEHICLE.Tabs.CrewPassengers',
    content: {
      component: VehiclePassengersAndCrewTab,
      type: 'svelte',
    },
    layout: 'classic',
  },
  {
    id: CONSTANTS.TAB_VEHICLE_CARGO,
    title: 'DND5E.VEHICLE.Tabs.Cargo',
    content: {
      component: VehicleCargoTab,
      type: 'svelte',
    },
    layout: 'classic',
  },
  {
    id: CONSTANTS.TAB_EFFECTS,
    title: 'DND5E.Effects',
    content: {
      component: ActorEffectsTab,
      type: 'svelte',
    },
    layout: 'classic',
  },
  {
    id: CONSTANTS.TAB_VEHICLE_DESCRIPTION_LEGACY,
    title: 'DND5E.Description',
    content: {
      component: VehicleDescriptionTab,
      type: 'svelte',
    },
    layout: 'classic',
  },
];

const singleton = new ActorSheetRuntime<VehicleSheetContext>(
  defaultVehicleClassicTabs,
  []
);

export default singleton;
