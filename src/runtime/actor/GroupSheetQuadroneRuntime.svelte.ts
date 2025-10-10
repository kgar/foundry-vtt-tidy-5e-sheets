import type { GroupSheetQuadroneContext } from 'src/types/types';
import { ActorSheetQuadroneRuntime } from '../ActorSheetQuadroneRuntime.svelte';
import GroupMembersTab from 'src/sheets/quadrone/actor/tabs/GroupMembersTab.svelte';
import { CONSTANTS } from 'src/constants';
import GroupInventoryTab from 'src/sheets/quadrone/actor/tabs/GroupInventoryTab.svelte';
import GroupDescriptionTab from 'src/sheets/quadrone/actor/tabs/GroupDescriptionTab.svelte';
import GroupBastionsTab from 'src/sheets/quadrone/actor/tabs/GroupBastionsTab.svelte';
import { systemSettings } from 'src/settings/settings.svelte';

export const GroupSheetQuadroneRuntime =
  new ActorSheetQuadroneRuntime<GroupSheetQuadroneContext>(
    [
      {
        title: 'DND5E.Group.Member.other',
        content: {
          component: GroupMembersTab,
          type: 'svelte',
        },
        id: CONSTANTS.TAB_MEMBERS,
        layout: 'quadrone',
        iconClass: 'fa-solid fa-people-group',
      },
      {
        title: 'DND5E.Inventory',
        content: {
          component: GroupInventoryTab,
          type: 'svelte',
        },
        id: CONSTANTS.TAB_ACTOR_INVENTORY,
        layout: 'quadrone',
        iconClass: 'fa-solid fa-treasure-chest',
      },
      // TODO: Determine, do we really need it?
      // {
      //   title: 'DND5E.Bastion.Configuration.Name',
      //   content: {
      //     component: GroupBastionsTab,
      //     type: 'svelte',
      //   },
      //   enabled: (_context) => {
      //     return !!systemSettings.value.bastionConfiguration.enabled;
      //   },
      //   id: CONSTANTS.TAB_GROUP_BASTIONS,
      //   layout: 'quadrone',
      //   iconClass: 'fa-solid fa-house-turret',
      // },
      {
        title: 'DND5E.Description',
        content: {
          component: GroupDescriptionTab,
          type: 'svelte',
        },
        id: CONSTANTS.TAB_DESCRIPTION,
        layout: 'quadrone',
        iconClass: 'fa-solid fa-feather',
      },
    ],
    [
      CONSTANTS.TAB_MEMBERS,
      CONSTANTS.TAB_ACTOR_INVENTORY,
      // CONSTANTS.TAB_GROUP_BASTIONS,
      CONSTANTS.TAB_DESCRIPTION,
    ]
  );
