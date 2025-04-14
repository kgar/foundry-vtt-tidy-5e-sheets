import type { CustomContent, Tab } from 'src/types/types';
import type { RegisteredContent, RegisteredTab, SheetLayout } from './types';
import { CONSTANTS } from 'src/constants';
import { debug, error, warn } from 'src/utils/logging';
import { TabManager } from './tab/TabManager';
import type { ActorTabRegistrationOptions } from 'src/api/api.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import GroupMembersTab from 'src/sheets/classic/group/tabs/GroupMembersTab.svelte';
import GroupInventoryTab from 'src/sheets/classic/group/tabs/GroupInventoryTab.svelte';
import GroupDescriptionTab from 'src/sheets/classic/group/tabs/GroupDescriptionTab.svelte';
import type { GroupSheetClassicContext } from 'src/types/group.types';
import { isNil } from 'src/utils/data';

class GroupSheetRuntime {
  private _content = $state<RegisteredContent<GroupSheetClassicContext>[]>([]);
  private _tabs = $state<RegisteredTab<GroupSheetClassicContext>[]>([
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
  ]);
  tabMap = $derived(
    this._tabs.reduce<Map<string, RegisteredTab<GroupSheetClassicContext>>>(
      (map, curr) => {
        map.set(curr.id, curr);
        return map;
      },
      new Map<string, RegisteredTab<GroupSheetClassicContext>>()
    )
  );

  get content(): RegisteredContent<GroupSheetClassicContext>[] {
    return this._content;
  }

  async getTabs(context: GroupSheetClassicContext): Promise<Tab[]> {
    return await TabManager.prepareTabsForRender(context, this._tabs);
  }

  getAllRegisteredTabs(
    layout: SheetLayout
  ): RegisteredTab<GroupSheetClassicContext>[] {
    const result = [...this._tabs];

    return layout === CONSTANTS.SHEET_LAYOUT_ALL || isNil(layout)
      ? result
      : result.filter(
          (x) => x.layout === layout || x.layout === CONSTANTS.SHEET_LAYOUT_ALL
        );
  }

  registerContent(
    registeredContent: RegisteredContent<GroupSheetClassicContext>
  ) {
    this._content.push(registeredContent);
  }

  registerTab(
    tab: RegisteredTab<GroupSheetClassicContext>,
    options?: ActorTabRegistrationOptions
  ) {
    const tabExists = this._tabs.some((t) => t.id === tab.id);

    if (tabExists && !options?.overrideExisting) {
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

  // TODO: Move this to a world setting
  getDefaultTabs(): string[] {
    return [
      CONSTANTS.TAB_GROUP_MEMBERS,
      CONSTANTS.TAB_ACTOR_INVENTORY,
      CONSTANTS.TAB_GROUP_DESCRIPTION,
    ];
  }
}

const singleton = new GroupSheetRuntime();

export default singleton;
