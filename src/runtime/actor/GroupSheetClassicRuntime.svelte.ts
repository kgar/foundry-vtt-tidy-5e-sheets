import type { GroupSheetClassicContext } from 'src/types/group.types';
import { ActorSheetRuntime } from '../ActorSheetRuntime.svelte';
import { CONSTANTS } from 'src/constants';
import type { RegisteredTab } from '../types';
import GroupMembersTab from 'src/sheets/classic/group/tabs/GroupMembersTab.svelte';
import GroupInventoryTab from 'src/sheets/classic/group/tabs/GroupInventoryTab.svelte';
import GroupDescriptionTab from 'src/sheets/classic/group/tabs/GroupDescriptionTab.svelte';

const defaultGroupClassicTabs: RegisteredTab<GroupSheetClassicContext>[] = [
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
    id: CONSTANTS.TAB_DESCRIPTION,
    title: 'DND5E.Description',
    content: {
      component: GroupDescriptionTab,
      type: 'svelte',
    },
    layout: 'classic',
  },
];

const singleton = new ActorSheetRuntime<GroupSheetClassicContext>(
  defaultGroupClassicTabs,
  []
);

export default singleton;
