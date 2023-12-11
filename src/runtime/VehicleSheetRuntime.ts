import type { Tab, VehicleSheetContext } from 'src/types/types';
import { CONSTANTS } from 'src/constants';
import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
import VehicleAttributesTab from 'src/sheets/vehicle/tabs/VehicleAttributesTab.svelte';
import VehicleCargoAndCrewTab from 'src/sheets/vehicle/tabs/VehicleCargoAndCrewTab.svelte';
import VehicleDescriptionTab from 'src/sheets/vehicle/tabs/VehicleDescriptionTab.svelte';
import ActorActionsTab from 'src/sheets/actor/tabs/ActorActionsTab.svelte';
import type { RegisteredActorTab } from './types';
import { warn } from 'src/utils/logging';
import { ActorSheetRuntimeManager } from './ActorSheetRuntimeManager';

export class VehicleSheetRuntime {
  private static _tabs: RegisteredActorTab<VehicleSheetContext>[] = [
    {
      title: 'T5EK.Actions.TabName',
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
      id: CONSTANTS.TAB_NPC_EFFECTS,
      title: 'DND5E.Effects',
      content: {
        component: ActorEffectsTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_VEHICLE_DESCRIPTION,
      title: 'DND5E.Description',
      content: {
        component: VehicleDescriptionTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
  ];

  static getTabs(context: VehicleSheetContext): Promise<Tab[]> {
    return ActorSheetRuntimeManager.prepareTabsForRender(
      context,
      VehicleSheetRuntime._tabs
    );
  }

  static getAllRegisteredTabs(): RegisteredActorTab<VehicleSheetContext>[] {
    return [...VehicleSheetRuntime._tabs];
  }

  static registerTab(tab: RegisteredActorTab<VehicleSheetContext>) {
    const tabExists = VehicleSheetRuntime.getAllRegisteredTabs().some(
      (t) => t.id === tab.id
    );

    if (tabExists) {
      warn(`Tab with id ${tab.id} already exists.`);
      return;
    }

    VehicleSheetRuntime._tabs.push(tab);

    return VehicleSheetRuntime.getAllRegisteredTabs();
  }
}
