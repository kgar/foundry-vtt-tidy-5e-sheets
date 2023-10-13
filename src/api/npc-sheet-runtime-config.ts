import type { NpcSheetContext, Tab } from 'src/types/types';
import { derived, writable } from 'svelte/store';
import { CONSTANTS } from 'src/constants';
import NpcAbilitiesTab from 'src/sheets/npc/NpcAbilitiesTab.svelte';
import NpcSpellbookTab from 'src/sheets/npc/NpcSpellbookTab.svelte';
import NpcBiographyTab from 'src/sheets/npc/NpcBiographyTab.svelte';
import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
import ActorJournalTab from 'src/components/player-character/ActorJournalTab.svelte';

type SheetTabRuntimeConfig<TContext> = Tab & {
  enabled: boolean | ((context: TContext) => boolean);
  order: number;
};

type NpcSheetRuntimeConfig = {
  sheetTabs: SheetTabRuntimeConfig<NpcSheetContext>[];
};

function getDefaultTabConfigs(): SheetTabRuntimeConfig<NpcSheetContext>[] {
  return [
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
  ];
}

let npcSheetConfigStore = writable<NpcSheetRuntimeConfig>({
  sheetTabs: getDefaultTabConfigs(),
});

export let npcSheetTabsStore = derived(npcSheetConfigStore, (c) => ({
  getTabs: (context: NpcSheetContext) =>
    [...c.sheetTabs]
      .filter(
        (t) =>
          t.enabled === true ||
          (typeof t.enabled === 'function' && t.enabled(context))
      )
      .sort((a, b) => a.order - b.order),
}));
