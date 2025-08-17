import { ActorSheetRuntime } from '../ActorSheetRuntime.svelte';
import type { VehicleSheetContext } from 'src/types/types';
import ActorEffectsTab from 'src/sheets/classic/actor/ActorEffectsTab.svelte';
import VehicleAttributesTab from 'src/sheets/classic/vehicle/tabs/VehicleAttributesTab.svelte';
import VehicleCargoAndCrewTab from 'src/sheets/classic/vehicle/tabs/VehicleCargoAndCrewTab.svelte';
import VehicleDescriptionTab from 'src/sheets/classic/vehicle/tabs/VehicleDescriptionTab.svelte';
import ActorActionsTab from 'src/sheets/classic/actor/tabs/ActorActionsTab.svelte';
import type { RegisteredTab } from '../types';
import { CONSTANTS } from 'src/constants';

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
    id: CONSTANTS.TAB_VEHICLE_CARGO_AND_CREW,
    title: 'DND5E.VehicleCargoCrew',
    content: {
      component: VehicleCargoAndCrewTab,
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
