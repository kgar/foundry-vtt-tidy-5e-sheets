import type { VehicleSheetContext } from 'src/types/types';
import { CONSTANTS } from 'src/constants';
import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
import VehicleAttributesTab from 'src/sheets/vehicle/tabs/VehicleAttributesTab.svelte';
import VehicleCargoAndCrewTab from 'src/sheets/vehicle/tabs/VehicleCargoAndCrewTab.svelte';
import VehicleDescriptionTab from 'src/sheets/vehicle/tabs/VehicleDescriptionTab.svelte';
import ActorActionsTab from 'src/sheets/actor/tabs/ActorActionsTab.svelte';
import type { SheetTabRegistrationOptions, SheetTabState } from './types';
import { getOrderedEnabledSheetTabs } from './state-functions';
import { warn } from 'src/utils/logging';

export class VehicleSheetRuntime {
  private static _tabs: SheetTabState<VehicleSheetContext>[] = [
    {
      displayName: 'T5EK.Actions.TabName',
      content: {
        component: ActorActionsTab,
        type: 'svelte',
      },
      enabled: true,
      id: CONSTANTS.TAB_ACTOR_ACTIONS,
      order: 10,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_VEHICLE_ATTRIBUTES,
      displayName: 'DND5E.Attributes',
      content: {
        component: VehicleAttributesTab,
        type: 'svelte',
      },
      enabled: true,
      order: 20,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_VEHICLE_CARGO_AND_CREW,
      displayName: 'DND5E.VehicleCargoCrew',
      content: {
        component: VehicleCargoAndCrewTab,
        type: 'svelte',
      },
      enabled: true,
      order: 30,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_NPC_EFFECTS,
      displayName: 'DND5E.Effects',
      content: {
        component: ActorEffectsTab,
        type: 'svelte',
      },
      enabled: true,
      order: 40,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_VEHICLE_DESCRIPTION,
      displayName: 'DND5E.Description',
      content: {
        component: VehicleDescriptionTab,
        type: 'svelte',
      },
      enabled: true,
      order: 50,
      layout: 'classic',
    },
  ];

  static getTabs(context: VehicleSheetContext) {
    return getOrderedEnabledSheetTabs(VehicleSheetRuntime._tabs, context);
  }

  static getAllRegisteredTabs(): SheetTabState<VehicleSheetContext>[] {
    return [...VehicleSheetRuntime._tabs];
  }

  static registerTab(
    tab: SheetTabState<VehicleSheetContext>,
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
