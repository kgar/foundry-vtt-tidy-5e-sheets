import type { NpcSheetContext, Tab } from 'src/types/types';
import { derived, get, writable } from 'svelte/store';
import { CONSTANTS } from 'src/constants';
import NpcAbilitiesTab from 'src/sheets/npc/tabs/NpcAbilitiesTab.svelte';
import NpcSpellbookTab from 'src/sheets/npc/tabs/NpcSpellbookTab.svelte';
import NpcBiographyTab from 'src/sheets/npc/tabs/NpcBiographyTab.svelte';
import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
import ActorJournalTab from 'src/sheets/actor/tabs/ActorJournalTab.svelte';
import ActorActionsTab from 'src/sheets/actor/tabs/ActorActionsTab.svelte';
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
      displayName: 'T5EK.ActionsTabName',
      content: {
        component: ActorActionsTab,
      },
      enabled: true,
      id: CONSTANTS.TAB_ACTOR_ACTIONS,
      order: 10,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_NPC_ABILITIES,
      displayName: 'T5EK.Abilities',
      content: {
        component: NpcAbilitiesTab,
      },
      enabled: true,
      order: 20,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_NPC_SPELLBOOK,
      displayName: 'DND5E.Spellbook',
      content: {
        component: NpcSpellbookTab,
      },
      enabled: (context) =>
        !context.hideEmptySpellbook && context.showSpellbookTab,
      order: 30,
      layout: 'classic',
    },
    {
      id: 'effects',
      displayName: 'DND5E.Effects',
      content: {
        component: ActorEffectsTab,
      },
      enabled: true,
      order: 40,
      layout: 'classic',
    },
    {
      id: 'biography',
      displayName: 'DND5E.Biography',
      content: {
        component: NpcBiographyTab,
      },
      enabled: true,
      order: 50,
      layout: 'classic',
    },
    {
      id: 'journal',
      displayName: 'T5EK.Journal',
      content: {
        component: ActorJournalTab,
      },
      enabled: (context) => context.owner && context.useJournalTab,
      order: 60,
      layout: 'classic',
    },
  ],
});

export function getAllRegisteredNpcSheetTabs(): SheetTabState<NpcSheetContext>[] {
  return [...get(npcSheetState).sheetTabs];
}

export let registeredNpcTabs = derived(npcSheetState, (c) => ({
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
