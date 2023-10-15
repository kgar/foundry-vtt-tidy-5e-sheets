import type { NpcSheetContext, Tab } from 'src/types/types';
import { derived, get, writable } from 'svelte/store';
import { CONSTANTS } from 'src/constants';
import NpcAbilitiesTab from 'src/sheets/npc/NpcAbilitiesTab.svelte';
import NpcSpellbookTab from 'src/sheets/npc/NpcSpellbookTab.svelte';
import NpcBiographyTab from 'src/sheets/npc/NpcBiographyTab.svelte';
import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
import ActorJournalTab from 'src/components/player-character/ActorJournalTab.svelte';
import type { NpcSheetState, SheetTabState } from './types';
import { getOrderedEnabledSheetTabs } from './state-functions';

let npcSheetState = writable<NpcSheetState>({
  sheetTabs: [
    {
      id: CONSTANTS.TAB_NPC_ABILITIES,
      displayName: 'T5EK.Abilities',
      content: {
        component: NpcAbilitiesTab,
      },
      enabled: true,
      order: 10,
    },
    {
      id: CONSTANTS.TAB_NPC_SPELLBOOK,
      displayName: 'DND5E.Spellbook',
      content: {
        component: NpcSpellbookTab,
      },
      enabled: (context) =>
        !context.hideEmptySpellbook && !context.hideSpellbookTab,
      order: 20,
    },
    {
      id: 'effects',
      displayName: 'DND5E.Effects',
      content: {
        component: ActorEffectsTab,
      },
      enabled: true,
      order: 30,
    },
    {
      id: 'biography',
      displayName: 'DND5E.Biography',
      content: {
        component: NpcBiographyTab,
      },
      enabled: true,
      order: 40,
    },
    {
      id: 'journal',
      displayName: 'T5EK.Journal',
      content: {
        component: ActorJournalTab,
      },
      enabled: (context) => context.owner && !context.npcJournalTabDisabled,
      order: 50,
    },
  ],
});

export function getCurrentNpcTabs(): SheetTabState<NpcSheetContext>[] {
  return [...get(npcSheetState).sheetTabs];
}

export let npcSheetTabsStore = derived(npcSheetState, (c) => ({
  getTabs: (context: NpcSheetContext) =>
    getOrderedEnabledSheetTabs(c.sheetTabs, context),
}));
