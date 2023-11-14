import type { CharacterSheetContext } from 'src/types/types';
import { derived, get, writable } from 'svelte/store';
import CharacterAttributesTab from 'src/sheets/character/tabs/CharacterAttributesTab.svelte';
import CharacterInventoryTab from 'src/sheets/character/tabs/CharacterInventoryTab.svelte';
import CharacterSpellbookTab from 'src/sheets/character/tabs/CharacterSpellbookTab.svelte';
import CharacterFeaturesTab from 'src/sheets/character/tabs/CharacterFeaturesTab.svelte';
import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
import CharacterBiographyTab from 'src/sheets/character/tabs/CharacterBiographyTab.svelte';
import ActorJournalTab from 'src/sheets/character/tabs/ActorJournalTab.svelte';
import type {
  CharacterSheetState,
  SheetTabRegistrationOptions,
  SheetTabState,
} from './types';
import { getOrderedEnabledSheetTabs } from './state-functions';
import { CONSTANTS } from 'src/constants';
import { warn } from 'src/utils/logging';

let characterSheetState = writable<CharacterSheetState>({
  sheetTabs: [
    {
      id: CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
      displayName: 'DND5E.Attributes',
      content: {
        component: CharacterAttributesTab,
      },
      enabled: true,
      order: 10,
      layout: 'classic'
    },
    {
      id: CONSTANTS.TAB_CHARACTER_INVENTORY,
      displayName: 'DND5E.Inventory',
      content: {
        component: CharacterInventoryTab,
      },
      enabled: true,
      order: 20,
      layout: 'classic'
    },
    {
      id: CONSTANTS.TAB_CHARACTER_SPELLBOOK,
      displayName: 'DND5E.Spellbook',
      content: {
        component: CharacterSpellbookTab,
      },
      enabled: true,
      order: 30,
      layout: 'classic'
    },
    {
      id: CONSTANTS.TAB_CHARACTER_FEATURES,
      displayName: 'DND5E.Features',
      content: {
        component: CharacterFeaturesTab,
      },
      enabled: true,
      order: 40,
      layout: 'classic'
    },
    {
      id: CONSTANTS.TAB_CHARACTER_EFFECTS,
      displayName: 'DND5E.Effects',
      content: {
        component: ActorEffectsTab,
      },
      enabled: true,
      order: 50,
      layout: 'classic'
    },
    {
      id: CONSTANTS.TAB_CHARACTER_BIOGRAPHY,
      displayName: 'DND5E.Biography',
      content: {
        component: CharacterBiographyTab,
      },
      enabled: true,
      order: 60,
      layout: 'classic'
    },
    {
      id: CONSTANTS.TAB_CHARACTER_JOURNAL,
      displayName: 'T5EK.Journal',
      content: {
        component: ActorJournalTab,
      },
      enabled: (context) =>
        context.owner && context.useJournalTab,
      order: 70,
      layout: 'classic'
    },
  ],
});

export function getAllRegisteredCharacterSheetTabs(): SheetTabState<CharacterSheetContext>[] {
  return [...get(characterSheetState).sheetTabs];
}

export let currentCharacterSheetTabs = derived(characterSheetState, (c) => ({
  getTabs: (context: CharacterSheetContext) =>
    getOrderedEnabledSheetTabs(c.sheetTabs, context),
}));

export function registerCharacterSheetTab(
  tab: SheetTabState<CharacterSheetContext>,
  options?: SheetTabRegistrationOptions
) {
  const tabExists = getAllRegisteredCharacterSheetTabs().some((t) => t.id === tab.id);

  if (tabExists && !options?.overwrite) {
    warn(
      `Tab with id ${tab.id} already exists. Use option "overwrite" to replace an existing tab.`
    );
    return;
  }

  characterSheetState.update((state) => {
    state.sheetTabs.push(tab);
    state.sheetTabs.sort((a, b) => a.order - b.order);
    return state;
  });

  return getAllRegisteredCharacterSheetTabs();
}

export function unregisterCharacterSheetTab(tabId: string) {
  characterSheetState.update((state) => {
    state.sheetTabs = [...state.sheetTabs.filter((t) => t.id !== tabId)];
    return state;
  });
}
