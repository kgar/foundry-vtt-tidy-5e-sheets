import type {
  CharacterSheetContext,
  CustomContent,
  Tab,
} from 'src/types/types';
import CharacterAttributesTab from 'src/sheets/character/tabs/CharacterAttributesTab.svelte';
import ActorInventoryTab from 'src/sheets/actor/tabs/ActorInventoryTab.svelte';
import CharacterSpellbookTab from 'src/sheets/character/tabs/CharacterSpellbookTab.svelte';
import CharacterFeaturesTab from 'src/sheets/character/tabs/CharacterFeaturesTab.svelte';
import CharacterEffectsTab from 'src/sheets/character/tabs/CharacterEffectsTab.svelte';
import CharacterBiographyTab from 'src/sheets/character/tabs/CharacterBiographyTab.svelte';
import ActorJournalTab from 'src/sheets/actor/tabs/ActorJournalTab.svelte';
import ActorActionsTab from 'src/sheets/actor/tabs/ActorActionsTab.svelte';
import type { RegisteredContent, RegisteredTab } from './types';
import { CONSTANTS } from 'src/constants';
import { debug, error, warn } from 'src/utils/logging';
import { TabManager } from './tab/TabManager';
import type { ActorTabRegistrationOptions } from 'src/api/api.types';
import { CustomContentManager } from './content/CustomContentManager';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import GroupMembersTab from 'src/sheets/group/tabs/GroupMembersTab.svelte';
import GroupInventoryTab from 'src/sheets/group/tabs/GroupInventoryTab.svelte';
import GroupDescriptionTab from 'src/sheets/group/tabs/GroupDescriptionTab.svelte';

export class GroupSheetRuntime {
  private static _content: RegisteredContent<CharacterSheetContext>[] = [];
  private static _tabs: RegisteredTab<CharacterSheetContext>[] = [
    {
      id: CONSTANTS.TAB_GROUP_MEMBERS,
      title: 'DND5E.Group.Member.other',
      content: {
        component: GroupMembersTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_ACTOR_INVENTORY,
      title: 'DND5E.Inventory',
      content: {
        component: GroupInventoryTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_GROUP_DESCRIPTION,
      title: 'DND5E.Description',
      content: {
        component: GroupDescriptionTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
  ];

  static async getContent(
    context: CharacterSheetContext
  ): Promise<CustomContent[]> {
    return await CustomContentManager.prepareContentForRender(
      context,
      GroupSheetRuntime._content
    );
  }

  static async getTabs(context: CharacterSheetContext): Promise<Tab[]> {
    return await TabManager.prepareTabsForRender(
      context,
      GroupSheetRuntime._tabs
    );
  }

  static getAllRegisteredTabs(): RegisteredTab<CharacterSheetContext>[] {
    return [...GroupSheetRuntime._tabs];
  }

  static registerContent(
    registeredContent: RegisteredContent<CharacterSheetContext>
  ) {
    this._content.push(registeredContent);
  }

  static registerTab(
    tab: RegisteredTab<CharacterSheetContext>,
    options?: ActorTabRegistrationOptions
  ) {
    const tabExists = GroupSheetRuntime._tabs.some((t) => t.id === tab.id);

    if (tabExists && !options?.overrideExisting) {
      warn(`Tab with id ${tab.id} already exists.`);
      return;
    }

    if (tabExists && options?.overrideExisting) {
      const index = GroupSheetRuntime._tabs.findIndex((t) => t.id === tab.id);
      if (index >= 0) {
        GroupSheetRuntime._tabs.splice(index, 1);
      }
    }

    GroupSheetRuntime._tabs.push(tab);
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
