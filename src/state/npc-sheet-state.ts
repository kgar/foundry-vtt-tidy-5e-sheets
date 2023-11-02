import type { NpcSheetContext, Tab } from 'src/types/types';
import { derived, get, writable } from 'svelte/store';
import { CONSTANTS } from 'src/constants';
import NpcAbilitiesTab from 'src/sheets/npc/NpcAbilitiesTab.svelte';
import NpcSpellbookTab from 'src/sheets/npc/NpcSpellbookTab.svelte';
import NpcBiographyTab from 'src/sheets/npc/NpcBiographyTab.svelte';
import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
import ActorJournalTab from 'src/sheets/character/tabs/ActorJournalTab.svelte';
import type {
  NpcSheetState,
  SheetTabRegistrationOptions,
  SheetTabState,
} from './types';
import { getOrderedEnabledSheetTabs } from './state-functions';
import { warn } from 'src/utils/logging';

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
      layout: 'classic',
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
      layout: 'classic',
    },
    {
      id: 'effects',
      displayName: 'DND5E.Effects',
      content: {
        component: ActorEffectsTab,
      },
      enabled: true,
      order: 30,
      layout: 'classic',
    },
    {
      id: 'biography',
      displayName: 'DND5E.Biography',
      content: {
        component: NpcBiographyTab,
      },
      enabled: true,
      order: 40,
      layout: 'classic',
    },
    {
      id: 'journal',
      displayName: 'T5EK.Journal',
      content: {
        component: ActorJournalTab,
      },
      enabled: (context) => context.owner && !context.npcJournalTabDisabled,
      order: 50,
      layout: 'classic',
    },
  ],
});

export function getAllRegisteredNpcSheetTabs(): SheetTabState<NpcSheetContext>[] {
  return [...get(npcSheetState).sheetTabs];
}

export let currentNpcSheetTabs = derived(npcSheetState, (c) => ({
  getTabs: (context: NpcSheetContext) =>
    getOrderedEnabledSheetTabs(c.sheetTabs, context),
}));

export function registerNpcSheetTab(
  tab: SheetTabState<NpcSheetContext>,
  options?: SheetTabRegistrationOptions
) {
  const tabExists = getAllRegisteredNpcSheetTabs().some((t) => t.id === tab.id);

  if (tabExists && !options?.overwrite) {
    warn(
      `Tab with id ${tab.id} already exists. Use option "overwrite" to replace an existing tab.`
    );
    return;
  }

  npcSheetState.update((state) => {
    state.sheetTabs.push(tab);
    state.sheetTabs.sort((a, b) => a.order - b.order);
    return state;
  });

  return getAllRegisteredNpcSheetTabs();
}

export function unregisterNpcSheetTab(tabId: string) {
  npcSheetState.update((state) => {
    state.sheetTabs = [...state.sheetTabs.filter((t) => t.id !== tabId)];
    return state;
  });
}
