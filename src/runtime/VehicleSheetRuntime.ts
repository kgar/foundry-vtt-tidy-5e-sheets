import type { CustomContent, Tab, VehicleSheetContext } from 'src/types/types';
import { CONSTANTS } from 'src/constants';
import ActorEffectsTab from 'src/sheets/classic/actor/ActorEffectsTab.svelte';
import VehicleAttributesTab from 'src/sheets/classic/vehicle/tabs/VehicleAttributesTab.svelte';
import VehicleCargoAndCrewTab from 'src/sheets/classic/vehicle/tabs/VehicleCargoAndCrewTab.svelte';
import VehicleDescriptionTab from 'src/sheets/classic/vehicle/tabs/VehicleDescriptionTab.svelte';
import ActorActionsTab from 'src/sheets/classic/actor/tabs/ActorActionsTab.svelte';
import type { RegisteredContent, RegisteredTab } from './types';
import { debug, error, warn } from 'src/utils/logging';
import { TabManager } from './tab/TabManager';
import type { ActorTabRegistrationOptions } from 'src/api/api.types';
import { CustomContentManager } from './content/CustomContentManager';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export class VehicleSheetRuntime {
  private static _content: RegisteredContent<VehicleSheetContext>[] = [];
  private static _tabs: RegisteredTab<VehicleSheetContext>[] = [
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

  static async getContent(
    context: VehicleSheetContext
  ): Promise<CustomContent[]> {
    return await CustomContentManager.prepareContentForRender(
      context,
      VehicleSheetRuntime._content
    );
  }

  static getTabs(context: VehicleSheetContext): Promise<Tab[]> {
    return TabManager.prepareTabsForRender(context, VehicleSheetRuntime._tabs);
  }

  static getAllRegisteredTabs(): RegisteredTab<VehicleSheetContext>[] {
    return [...VehicleSheetRuntime._tabs];
  }

  static registerContent(
    registeredContent: RegisteredContent<VehicleSheetContext>
  ) {
    this._content.push(registeredContent);
  }

  static registerTab(
    tab: RegisteredTab<VehicleSheetContext>,
    options?: ActorTabRegistrationOptions
  ) {
    const tabExists = VehicleSheetRuntime._tabs.some((t) => t.id === tab.id);

    if (tabExists) {
      warn(`Tab with id ${tab.id} already exists.`);
      return;
    }

    if (tabExists && options?.overrideExisting) {
      const index = VehicleSheetRuntime._tabs.findIndex((t) => t.id === tab.id);
      if (index >= 0) {
        VehicleSheetRuntime._tabs.splice(index, 1);
      }
    }

    VehicleSheetRuntime._tabs.push(tab);
  }

  static getTabTitle(tabId: string) {
    try {
      let tabTitle = this._tabs.find((t) => t.id === tabId)?.title;
      if (typeof tabTitle === 'function') {
        tabTitle = tabTitle();
      }
      return tabTitle ? FoundryAdapter.localize(tabTitle) : tabId;
    } catch (e) {
      error('An error occurred while searching for a tab title.', false, e);
      debug('Tab title error troubleshooting information', { tabId });
    }
  }
}
