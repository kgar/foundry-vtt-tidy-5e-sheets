import type { CharacterSheetContext } from 'src/types/types';
import { derived, writable } from 'svelte/store';
import CharacterAttributesTab from 'src/components/player-character/CharacterAttributesTab.svelte';
import CharacterInventoryTab from 'src/components/player-character/CharacterInventoryTab.svelte';
import CharacterSpellbookTab from 'src/components/player-character/CharacterSpellbookTab.svelte';
import CharacterFeaturesTab from 'src/components/player-character/CharacterFeaturesTab.svelte';
import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
import CharacterBiographyTab from 'src/components/player-character/CharacterBiographyTab.svelte';
import ActorJournalTab from 'src/components/player-character/ActorJournalTab.svelte';
import type {
  CharacterSheetState,
  SheetTabState,
} from './types';
import { getOrderedEnabledSheetTabs } from './state-functions';
import { CONSTANTS } from 'src/constants';

let characterSheetConfigStore = writable<CharacterSheetState>({
  sheetTabs: [
    {
      id: CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
      displayName: 'DND5E.Attributes',
      content: {
        component: CharacterAttributesTab,
      },
      enabled: true,
      order: 10,
    },
    {
      id: CONSTANTS.TAB_CHARACTER_INVENTORY,
      displayName: 'DND5E.Inventory',
      content: {
        component: CharacterInventoryTab,
      },
      enabled: true,
      order: 20,
    },
    {
      id: CONSTANTS.TAB_CHARACTER_SPELLBOOK,
      displayName: 'DND5E.Spellbook',
      content: {
        component: CharacterSpellbookTab,
      },
      enabled: true,
      order: 30,
    },
    {
      id: CONSTANTS.TAB_CHARACTER_FEATURES,
      displayName: 'DND5E.Features',
      content: {
        component: CharacterFeaturesTab,
      },
      enabled: true,
      order: 40,
    },
    {
      id: CONSTANTS.TAB_CHARACTER_EFFECTS,
      displayName: 'DND5E.Effects',
      content: {
        component: ActorEffectsTab,
      },
      enabled: true,
      order: 50,
    },
    {
      id: CONSTANTS.TAB_CHARACTER_BIOGRAPHY,
      displayName: 'DND5E.Biography',
      content: {
        component: CharacterBiographyTab,
      },
      enabled: true,
      order: 60,
    },
    {
      id: CONSTANTS.TAB_CHARACTER_JOURNAL,
      displayName: 'T5EK.Journal',
      content: {
        component: ActorJournalTab,
      },
      enabled: (context) =>
        context.owner && !context.characterJournalTabDisabled,
      order: 70,
    },
  ],
});

let currentTabs: SheetTabState<CharacterSheetContext>[] = [];

characterSheetConfigStore.subscribe((data) => {
  currentTabs = data.sheetTabs;
});

export function getCurrentCharacterTabs(): SheetTabState<CharacterSheetContext>[] {
  return [...currentTabs];
}

export let characterSheetTabsStore = derived(
  characterSheetConfigStore,
  (c) => ({
    getTabs: (context: CharacterSheetContext) =>
      getOrderedEnabledSheetTabs(c.sheetTabs, context),
  })
);

export function registerCharacterTab(
  tab: SheetTabState<CharacterSheetContext>
) {
  characterSheetConfigStore.update((store) => {
    store.sheetTabs.push(tab);
    store.sheetTabs.sort((a, b) => a.order - b.order);
    return store;
  });

  return getCurrentCharacterTabs();
}
