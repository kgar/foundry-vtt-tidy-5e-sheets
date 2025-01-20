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

class NpcSheetRuntime {
  private _content = $state<RegisteredContent<NpcSheetContext>[]>([]);
  private _tabs = $state<RegisteredTab<NpcSheetContext>[]>([
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
      id: CONSTANTS.TAB_ACTOR_SPELLBOOK,
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
  ]);
  tabMap = $derived(
    this._tabs.reduce<Map<string, RegisteredTab<NpcSheetContext>>>(
      (map, curr) => {
        map.set(curr.id, curr);
        return map;
      },
      new Map<string, RegisteredTab<NpcSheetContext>>()
    )
  );

  async getContent(context: CharacterSheetContext): Promise<CustomContent[]> {
    return await CustomContentManager.prepareContentForRender(
      context,
      this._content
    );
  }

  getTabs(context: NpcSheetContext): Promise<Tab[]> {
    return TabManager.prepareTabsForRender(context, this._tabs);
  }

  getAllRegisteredTabs(): RegisteredTab<NpcSheetContext>[] {
    return [...this._tabs];
  }

  registerContent(registeredContent: RegisteredContent<NpcSheetContext>) {
    this._content.push(registeredContent);
  }

  registerTab(
    tab: RegisteredTab<NpcSheetContext>,
    options?: ActorTabRegistrationOptions
  ) {
    const tabExists = this._tabs.some((t) => t.id === tab.id);

    if (tabExists) {
      warn(`Tab with id ${tab.id} already exists.`);
      return;
    }

    if (tabExists && options?.overrideExisting) {
      const index = this._tabs.findIndex((t) => t.id === tab.id);
      if (index >= 0) {
        this._tabs.splice(index, 1);
      }
    }

    this._tabs.push(tab);
  }

  getTabTitle(tabId: string) {
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

const singleton = new NpcSheetRuntime();

export default singleton;
