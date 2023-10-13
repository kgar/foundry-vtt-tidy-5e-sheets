import type {
  ActorSheetContext,
  CharacterSheetContext,
  Tab,
} from 'src/types/types';
import { derived, writable } from 'svelte/store';
import CharacterAttributesTab from 'src/components/player-character/CharacterAttributesTab.svelte';
import CharacterInventoryTab from 'src/components/player-character/CharacterInventoryTab.svelte';
import CharacterSpellbookTab from 'src/components/player-character/CharacterSpellbookTab.svelte';
import CharacterFeaturesTab from 'src/components/player-character/CharacterFeaturesTab.svelte';
import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
import CharacterBiographyTab from 'src/components/player-character/CharacterBiographyTab.svelte';
import ActorJournalTab from 'src/components/player-character/ActorJournalTab.svelte';

type SheetTabRuntimeConfig<TContext> = Tab & {
  enabled: boolean | ((context: TContext) => boolean);
  order: number;
};

type CharacterSheetRuntimeConfig = {
  sheetTabs: SheetTabRuntimeConfig<CharacterSheetContext>[];
};

let characterSheetConfigStore = writable<CharacterSheetRuntimeConfig>({
  sheetTabs: [
    {
      id: 'attributes',
      displayName: 'DND5E.Attributes',
      content: {
        component: CharacterAttributesTab,
      },
      enabled: true,
      order: 10,
    },
    {
      id: 'inventory',
      displayName: 'DND5E.Inventory',
      content: {
        component: CharacterInventoryTab,
      },
      enabled: true,
      order: 20,
    },
    {
      id: 'spellbook',
      displayName: 'DND5E.Spellbook',
      content: {
        component: CharacterSpellbookTab,
      },
      enabled: true,
      order: 30,
    },
    {
      id: 'features',
      displayName: 'DND5E.Features',
      content: {
        component: CharacterFeaturesTab,
      },
      enabled: true,
      order: 40,
    },
    {
      id: 'effects',
      displayName: 'DND5E.Effects',
      content: {
        component: ActorEffectsTab,
      },
      enabled: true,
      order: 50,
    },
    {
      id: 'biography',
      displayName: 'DND5E.Biography',
      content: {
        component: CharacterBiographyTab,
      },
      enabled: true,
      order: 60,
    },
    {
      id: 'journal',
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

export let characterSheetTabsStore = derived(
  characterSheetConfigStore,
  (c) => ({
    getTabs: (context: CharacterSheetContext) =>
      [...c.sheetTabs]
        .filter(
          (t) =>
            t.enabled === true ||
            (typeof t.enabled === 'function' && t.enabled(context))
        )
        .sort((a, b) => a.order - b.order),
  })
);
