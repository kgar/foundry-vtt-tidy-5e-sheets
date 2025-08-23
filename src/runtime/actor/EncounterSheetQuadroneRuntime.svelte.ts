import type { EncounterSheetQuadroneContext } from 'src/types/types';
import { ActorSheetRuntime } from '../ActorSheetRuntime.svelte';
import { CONSTANTS } from 'src/constants';
import type { RegisteredTab } from '../types';
import EncounterMembersTab from 'src/sheets/quadrone/actor/tabs/EncounterMembersTab.svelte';
import EncounterInventoryTab from 'src/sheets/quadrone/actor/tabs/EncounterInventoryTab.svelte';
import EncounterDescriptionTab from 'src/sheets/quadrone/actor/tabs/EncounterDescriptionTab.svelte';

const defaultEncounterQuadroneTabs: RegisteredTab<EncounterSheetQuadroneContext>[] =
  [
    {
      id: CONSTANTS.TAB_MEMBERS,
      title: 'DND5E.Group.Member.other',
      content: {
        component: EncounterMembersTab,
        type: 'svelte',
      },
      layout: 'quadrone',
    },
    {
      id: CONSTANTS.TAB_ACTOR_INVENTORY,
      title: 'DND5E.Inventory',
      content: {
        component: EncounterInventoryTab,
        type: 'svelte',
      },
      layout: 'quadrone',
    },
    {
      id: CONSTANTS.TAB_DESCRIPTION,
      title: 'DND5E.Description',
      content: {
        component: EncounterDescriptionTab,
        type: 'svelte',
      },
      layout: 'quadrone',
    },
  ];

const singleton = new ActorSheetRuntime<EncounterSheetQuadroneContext>(
  defaultEncounterQuadroneTabs,
  [
    CONSTANTS.TAB_MEMBERS,
    CONSTANTS.TAB_ACTOR_INVENTORY,
    CONSTANTS.TAB_DESCRIPTION,
  ]
);

export default singleton;
