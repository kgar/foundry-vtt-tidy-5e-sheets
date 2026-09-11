import type { EncounterSheetQuadroneContext } from 'src/types/types';
import { CONSTANTS } from 'src/constants';
import EncounterMembersTab from 'src/sheets/quadrone/actor/tabs/EncounterMembersTab.svelte';
import EncounterInventoryTab from 'src/sheets/quadrone/actor/tabs/EncounterInventoryTab.svelte';
import EncounterDescriptionTab from 'src/sheets/quadrone/actor/tabs/EncounterDescriptionTab.svelte';
import { ActorSheetQuadroneRuntime } from '../ActorSheetQuadroneRuntime.svelte';
import { buildActorInventoryTabOptions } from 'src/settings/tab-options/ActorInventoryTabOptions';

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
        tabOptionsBuilder: buildActorInventoryTabOptions,
      },
      // TODO: Figure out how to do Placeholder Combatants in dnd5e 6.0+. See https://discord.com/channels/1167985253072257115/1545585824832159864/1545866451468943421
      // {
      //   id: CONSTANTS.TAB_ACTOR_COMBAT,
      //   title: 'TIDY5E.CombatTabName',
      //   content: {
      //     component: EncounterCombatTab,
      //     type: 'svelte',
      //   },
      //   layout: 'quadrone',
      //   iconClass: 'fa-solid fa-swords',
      // },
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
      // CONSTANTS.TAB_ACTOR_COMBAT,
      CONSTANTS.TAB_DESCRIPTION,
    ],
  );
