import type { CharacterSheetContext } from 'src/types/types';
import CharacterAttributesTab from 'src/sheets/character/tabs/CharacterAttributesTab.svelte';
import CharacterInventoryTab from 'src/sheets/character/tabs/CharacterInventoryTab.svelte';
import CharacterSpellbookTab from 'src/sheets/character/tabs/CharacterSpellbookTab.svelte';
import CharacterFeaturesTab from 'src/sheets/character/tabs/CharacterFeaturesTab.svelte';
import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
import CharacterBiographyTab from 'src/sheets/character/tabs/CharacterBiographyTab.svelte';
import ActorJournalTab from 'src/sheets/actor/tabs/ActorJournalTab.svelte';
import ActorActionsTab from 'src/sheets/actor/tabs/ActorActionsTab.svelte';
import type { SheetTabRegistrationOptions, SheetTabState } from './types';
import { getOrderedEnabledSheetTabs } from './state-functions';
import { CONSTANTS } from 'src/constants';
import { warn } from 'src/utils/logging';

export class CharacterSheetRuntime {
  private static _tabs: SheetTabState<CharacterSheetContext>[] = [
    {
      displayName: 'T5EK.Actions.TabName',
      content: {
        component: ActorActionsTab,
        type: 'svelte',
      },
      enabled: true,
      id: CONSTANTS.TAB_ACTOR_ACTIONS,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
      displayName: 'DND5E.Attributes',
      content: {
        component: CharacterAttributesTab,
        type: 'svelte',
      },
      enabled: true,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_INVENTORY,
      displayName: 'DND5E.Inventory',
      content: {
        component: CharacterInventoryTab,
        type: 'svelte',
      },
      enabled: true,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_SPELLBOOK,
      displayName: 'DND5E.Spellbook',
      content: {
        component: CharacterSpellbookTab,
        type: 'svelte',
      },
      enabled: true,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_FEATURES,
      displayName: 'DND5E.Features',
      content: {
        component: CharacterFeaturesTab,
        type: 'svelte',
      },
      enabled: true,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_EFFECTS,
      displayName: 'DND5E.Effects',
      content: {
        component: ActorEffectsTab,
        type: 'svelte',
      },
      enabled: true,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_BIOGRAPHY,
      displayName: 'DND5E.Biography',
      content: {
        component: CharacterBiographyTab,
        type: 'svelte',
      },
      enabled: true,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_JOURNAL,
      displayName: 'T5EK.JournalTabName',
      content: {
        component: ActorJournalTab,
        type: 'svelte',
      },
      enabled: (context) => context.owner,
      layout: 'classic',
    },
  ];

  static getTabs(context: CharacterSheetContext) {
    return getOrderedEnabledSheetTabs(CharacterSheetRuntime._tabs, context);
  }

  static getAllRegisteredTabs(): SheetTabState<CharacterSheetContext>[] {
    return [...CharacterSheetRuntime._tabs];
  }

  static registerTab(
    tab: SheetTabState<CharacterSheetContext>,
    options?: SheetTabRegistrationOptions
  ) {
    const tabExists = CharacterSheetRuntime.getAllRegisteredTabs().some(
      (t) => t.id === tab.id
    );

    if (tabExists && !options?.overwrite) {
      warn(
        `Tab with id ${tab.id} already exists. Use option "overwrite" to replace an existing tab.`
      );
      return;
    }

    CharacterSheetRuntime._tabs.push(tab);

    return CharacterSheetRuntime.getAllRegisteredTabs();
  }
}
