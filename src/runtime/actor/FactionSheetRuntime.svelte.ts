import type { FactionSheetContext } from 'src/types/types';
import { CONSTANTS } from 'src/constants';
import { ActorSheetQuadroneRuntime } from '../ActorSheetQuadroneRuntime.svelte';
import FactionMembersTab from 'src/sheets/quadrone/actor/tabs/FactionMembersTab.svelte';
import FactionDescriptionTab from 'src/sheets/quadrone/actor/tabs/FactionDescriptionTab.svelte';

export const FactionSheetRuntime =
  new ActorSheetQuadroneRuntime<FactionSheetContext>(
    [
      {
        id: CONSTANTS.TAB_MEMBERS,
        title: 'DND5E.Group.Member.other',
        content: {
          component: FactionMembersTab,
          type: 'svelte',
        },
        layout: 'quadrone',
        iconClass: 'fa-solid fa-people-group',
      },
      {
        id: CONSTANTS.TAB_DESCRIPTION,
        title: 'DND5E.Description',
        content: {
          component: FactionDescriptionTab,
          type: 'svelte',
        },
        layout: 'quadrone',
        iconClass: 'fa-solid fa-notebook',
      },
    ],
    [CONSTANTS.TAB_MEMBERS, CONSTANTS.TAB_DESCRIPTION],
  );
