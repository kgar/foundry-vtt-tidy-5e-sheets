import type { EncounterSheetQuadroneContext } from 'src/types/types';
import { CONSTANTS } from 'src/constants';
import EncounterMembersTab from 'src/sheets/quadrone/actor/tabs/EncounterMembersTab.svelte';
import EncounterInventoryTab from 'src/sheets/quadrone/actor/tabs/EncounterInventoryTab.svelte';
import EncounterDescriptionTab from 'src/sheets/quadrone/actor/tabs/EncounterDescriptionTab.svelte';
import { ActorSheetQuadroneRuntime } from '../ActorSheetQuadroneRuntime.svelte';

export const EncounterSheetQuadroneRuntime =
  new ActorSheetQuadroneRuntime<EncounterSheetQuadroneContext>(
    [
      {
        id: CONSTANTS.TAB_MEMBERS,
        title: 'DND5E.ENCOUNTER.Tab.Members',
        content: {
          component: EncounterMembersTab,
          type: 'svelte',
        },
        layout: 'quadrone',
        iconClass: 'fa-solid fa-people-group',
      },
      {
        id: CONSTANTS.TAB_ACTOR_INVENTORY,
        title: 'DND5E.ENCOUNTER.Tab.Loot',
        content: {
          component: EncounterInventoryTab,
          type: 'svelte',
        },
        layout: 'quadrone',
        iconClass: 'fa-solid fa-treasure-chest',
      },
      {
        id: CONSTANTS.TAB_DESCRIPTION,
        title: 'DND5E.ENCOUNTER.Tab.Description',
        content: {
          component: EncounterDescriptionTab,
          type: 'svelte',
        },
        layout: 'quadrone',
        iconClass: 'fa-solid fa-notebook',
      },
    ],
    [
      CONSTANTS.TAB_MEMBERS,
      CONSTANTS.TAB_ACTOR_INVENTORY,
      CONSTANTS.TAB_DESCRIPTION,
    ]
  );
