import type { VehicleSheetContext } from 'src/types/types';
import { CONSTANTS } from 'src/constants';
import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
import VehicleAttributesTab from 'src/sheets/vehicle/tabs/VehicleAttributesTab.svelte';
import VehicleCargoAndCrewTab from 'src/sheets/vehicle/tabs/VehicleCargoAndCrewTab.svelte';
import VehicleDescriptionTab from 'src/sheets/vehicle/tabs/VehicleDescriptionTab.svelte';
import ActorActionsTab from 'src/sheets/actor/tabs/ActorActionsTab.svelte';
import type { SheetTabRegistrationOptions, RegisteredActorTab } from './types';
import { getOrderedEnabledSheetTabs } from './runtime-functions';
import { warn } from 'src/utils/logging';

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

  static getTabs(context: VehicleSheetContext) {
    return getOrderedEnabledSheetTabs(VehicleSheetRuntime._tabs, context);
  }

  static getAllRegisteredTabs(): RegisteredActorTab<VehicleSheetContext>[] {
    return [...VehicleSheetRuntime._tabs];
  }

  static registerTab(
    tab: RegisteredActorTab<VehicleSheetContext>,
    options?: SheetTabRegistrationOptions
  ) {
    const tabExists = VehicleSheetRuntime.getAllRegisteredTabs().some(
      (t) => t.id === tab.id
    );

    if (tabExists && !options?.overwrite) {
      warn(
        `Tab with id ${tab.id} already exists. Use option "overwrite" to replace an existing tab.`
      );
      return;
    }

    VehicleSheetRuntime._tabs.push(tab);

    return VehicleSheetRuntime.getAllRegisteredTabs();
  }
}
