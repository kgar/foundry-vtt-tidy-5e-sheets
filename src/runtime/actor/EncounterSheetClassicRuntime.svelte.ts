import type { EncounterSheetClassicContext } from 'src/types/group.types';
import { ActorSheetRuntime } from '../ActorSheetRuntime.svelte';
import { CONSTANTS } from 'src/constants';
import type { RegisteredTab } from '../types';
import EncounterMembersTab from 'src/sheets/classic/encounter/tabs/EncounterMembersTab.svelte';
import EncounterInventoryTab from 'src/sheets/classic/encounter/tabs/EncounterInventoryTab.svelte';
import EncounterDescriptionTab from 'src/sheets/classic/encounter/tabs/EncounterDescriptionTab.svelte';

const defaultEncounterClassicTabs: RegisteredTab<EncounterSheetClassicContext>[] =
  [
    {
      id: CONSTANTS.TAB_GROUP_MEMBERS,
      title: 'DND5E.Group.Member.other',
      content: {
        component: EncounterMembersTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_ACTOR_INVENTORY,
      title: 'DND5E.Inventory',
      content: {
        component: EncounterInventoryTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_GROUP_DESCRIPTION,
      title: 'DND5E.Description',
      content: {
        component: EncounterDescriptionTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
  ];

const singleton = new ActorSheetRuntime<EncounterSheetClassicContext>(
  defaultEncounterClassicTabs,
  []
);

export default singleton;
