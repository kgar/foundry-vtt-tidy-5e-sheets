import { CONSTANTS } from 'src/constants';
import {
  SvelteApplicationMixin,
  type ApplicationRenderOptions,
} from '../mixins/SvelteApplicationMixin';
import type { SvelteComponent } from 'svelte';
import GroupSheet from './group/GroupSheet.svelte';
import type { GroupSheetClassicContext, Tab } from 'src/types/types';
import GroupMembersTab from './group/tabs/GroupMembersTab.svelte';
import GroupInventoryTab from './group/tabs/GroupInventoryTab.svelte';
import GroupDescriptionTab from './group/tabs/GroupDescriptionTab.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export class Tidy5eGroupSheet extends SvelteApplicationMixin<GroupSheetClassicContext>(
  foundry.applications.sheets.ActorSheetV2
) {
  static DEFAULT_OPTIONS = {
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      'actor',
      CONSTANTS.SHEET_TYPE_GROUP,
      'app-v2',
      CONSTANTS.SHEET_LAYOUT_CLASSIC,
    ],
    tag: 'form',
    window: {
      frame: true,
      positioned: true,
      resizable: true,
    },
    position: {
      width: 600,
      height: 700,
    },
  };

  // TODO: First render, derive options that come from user preference

  _createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    return new GroupSheet({
      target: node,
      context: new Map<any, any>([
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._store],
      ]),
    });
  }

  async _prepareContext(
    options: ApplicationRenderOptions
  ): Promise<GroupSheetClassicContext> {
    const tabs: Tab[] = [
      {
        content: {
          type: 'svelte',
          component: GroupMembersTab,
        },
        id: CONSTANTS.TAB_GROUP_MEMBERS,
        title: FoundryAdapter.localize('DND5E.Group.Member.other'),
      },
      {
        content: {
          type: 'svelte',
          component: GroupInventoryTab,
        },
        id: CONSTANTS.TAB_GROUP_INVENTORY,
        title: FoundryAdapter.localize('DND5E.Inventory'),
      },
      {
        content: {
          type: 'svelte',
          component: GroupDescriptionTab,
        },
        id: CONSTANTS.TAB_GROUP_DESCRIPTION,
        title: FoundryAdapter.localize('DND5E.Description'),
      },
    ];

    return {
      tabs: tabs,
    };
  }
}
