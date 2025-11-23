import { ActorSheetQuadroneRuntime } from '../ActorSheetQuadroneRuntime.svelte';
import type { VehicleSheetQuadroneContext } from 'src/types/types';
import ActorEffectsTab from 'src/sheets/quadrone/actor/tabs/ActorEffectsTab.svelte';
import VehicleAttributesTab from 'src/sheets/quadrone/actor/tabs/VehicleFeaturesTab.svelte';
import VehicleCargoAndCrewTab from 'src/sheets/quadrone/actor/tabs/VehicleCargoAndCrewTab.svelte';
import VehicleDescriptionTab from 'src/sheets/classic/vehicle/tabs/VehicleDescriptionTab.svelte';
import ActorActionsTab from 'src/sheets/classic/actor/tabs/ActorActionsTab.svelte';
import { CONSTANTS } from 'src/constants';

export const VehicleSheetQuadroneRuntime = new ActorSheetQuadroneRuntime<VehicleSheetQuadroneContext>(
  [
    // {
    //   title: 'TIDY5E.Actions.TabName',
    //   content: {
    //     component: ActorActionsTab,
    //     type: 'svelte',
    //   },
    //   id: CONSTANTS.TAB_ACTOR_ACTIONS,
    //   layout: 'quadrone',
    //   iconClass: 'fa-solid fa-chess-knight-piece',
    // },
    {
      id: CONSTANTS.TAB_VEHICLE_ATTRIBUTES,
      title: 'DND5E.Attributes',
      content: {
        component: VehicleAttributesTab,
        type: 'svelte',
      },
      layout: 'quadrone',
      iconClass: 'fa-solid fa-cog',
    },
    {
      id: CONSTANTS.TAB_VEHICLE_CARGO_AND_CREW,
      title: 'DND5E.VehicleCargoCrew',
      content: {
        component: VehicleCargoAndCrewTab,
        type: 'svelte',
      },
      layout: 'quadrone',
      iconClass: 'fa-solid fa-boxes-packing',
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
      id: CONSTANTS.TAB_VEHICLE_DESCRIPTION_LEGACY,
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
    // CONSTANTS.TAB_ACTOR_ACTIONS,
    CONSTANTS.TAB_VEHICLE_ATTRIBUTES,
    CONSTANTS.TAB_VEHICLE_CARGO_AND_CREW,
    CONSTANTS.TAB_EFFECTS,
    CONSTANTS.TAB_VEHICLE_DESCRIPTION_LEGACY,
  ]
);
