import type {
  CharacterSheetContext,
  CustomContent,
  NpcSheetContext,
  Tab,
} from 'src/types/types';
import { CONSTANTS } from 'src/constants';
import NpcAbilitiesTab from 'src/sheets/classic/npc/tabs/NpcAbilitiesTab.svelte';
import NpcSpellbookTab from 'src/sheets/classic/npc/tabs/NpcSpellbookTab.svelte';
import NpcBiographyTab from 'src/sheets/classic/npc/tabs/NpcBiographyTab.svelte';
import NpcEffectsTab from 'src/sheets/classic/npc/tabs/NpcEffectsTab.svelte';
import ActorJournalTab from 'src/sheets/classic/actor/tabs/ActorJournalTab.svelte';
import ActorActionsTab from 'src/sheets/classic/actor/tabs/ActorActionsTab.svelte';
import type { RegisteredContent, RegisteredTab } from './types';
import { debug, error, warn } from 'src/utils/logging';
import { TabManager } from './tab/TabManager';
import type { ActorTabRegistrationOptions } from 'src/api/api.types';
import { CustomContentManager } from './content/CustomContentManager';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import ActorInventoryTab from 'src/sheets/classic/actor/tabs/ActorInventoryTab.svelte';

export class NpcSheetRuntime {
  private static _content: RegisteredContent<NpcSheetContext>[] = [];
  private static _tabs: RegisteredTab<NpcSheetContext>[] = [
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
      id: CONSTANTS.TAB_NPC_ABILITIES,
      title: 'TIDY5E.Abilities',
      content: {
        component: NpcAbilitiesTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_NPC_SPELLBOOK,
      title: 'DND5E.Spellbook',
      content: {
        component: NpcSpellbookTab,
        type: 'svelte',
      },
      enabled: (context) =>
        !context.hideEmptySpellbook && context.showSpellbookTab,
      layout: 'classic',
    },
    {
      id: 'effects',
      title: 'DND5E.Effects',
      content: {
        component: NpcEffectsTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: 'biography',
      title: 'DND5E.Biography',
      content: {
        component: NpcBiographyTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: 'journal',
      title: 'TIDY5E.JournalTabName',
      content: {
        component: ActorJournalTab,
        type: 'svelte',
      },
      enabled: (context) => context.owner,
      layout: 'classic',
    },
    {
      id: 'inventory',
      title: 'DND5E.Inventory',
      content: {
        component: ActorInventoryTab,
        type: 'svelte',
        getProps() {
          return {
            tabId: CONSTANTS.TAB_ACTOR_INVENTORY,
          };
        },
      },
      enabled: (context) => context.owner,
      layout: 'classic',
    },
  ];

  static async getContent(
    context: CharacterSheetContext
  ): Promise<CustomContent[]> {
    return await CustomContentManager.prepareContentForRender(
      context,
      NpcSheetRuntime._content
    );
  }

  static getTabs(context: NpcSheetContext): Promise<Tab[]> {
    return TabManager.prepareTabsForRender(context, NpcSheetRuntime._tabs);
  }

  static getAllRegisteredTabs(): RegisteredTab<NpcSheetContext>[] {
    return [...NpcSheetRuntime._tabs];
  }

  static registerContent(
    registeredContent: RegisteredContent<NpcSheetContext>
  ) {
    this._content.push(registeredContent);
  }

  static registerTab(
    tab: RegisteredTab<NpcSheetContext>,
    options?: ActorTabRegistrationOptions
  ) {
    const tabExists = NpcSheetRuntime._tabs.some((t) => t.id === tab.id);

    if (tabExists) {
      warn(`Tab with id ${tab.id} already exists.`);
      return;
    }

    if (tabExists && options?.overrideExisting) {
      const index = NpcSheetRuntime._tabs.findIndex((t) => t.id === tab.id);
      if (index >= 0) {
        NpcSheetRuntime._tabs.splice(index, 1);
      }
    }

    NpcSheetRuntime._tabs.push(tab);
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
