import type { CharacterSheetContext } from 'src/types/types';
import CharacterAttributesTab from 'src/sheets/character/tabs/CharacterAttributesTab.svelte';
import CharacterInventoryTab from 'src/sheets/character/tabs/CharacterInventoryTab.svelte';
import CharacterSpellbookTab from 'src/sheets/character/tabs/CharacterSpellbookTab.svelte';
import CharacterFeaturesTab from 'src/sheets/character/tabs/CharacterFeaturesTab.svelte';
import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
import CharacterBiographyTab from 'src/sheets/character/tabs/CharacterBiographyTab.svelte';
import ActorJournalTab from 'src/sheets/actor/tabs/ActorJournalTab.svelte';
import ActorActionsTab from 'src/sheets/actor/tabs/ActorActionsTab.svelte';
import type { SheetTabRegistrationOptions, RegisteredActorTab } from './types';
import { getOrderedEnabledSheetTabs } from './runtime-functions';
import { CONSTANTS } from 'src/constants';
import { warn } from 'src/utils/logging';

export class CharacterSheetRuntime {
  private static _tabs: RegisteredActorTab<CharacterSheetContext>[] = [
    {
      title: 'T5EK.Actions.TabName',
      content: {
        component: ActorActionsTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_ACTOR_ACTIONS,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
      title: 'DND5E.Attributes',
      content: {
        component: CharacterAttributesTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_INVENTORY,
      title: 'DND5E.Inventory',
      content: {
        component: CharacterInventoryTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_SPELLBOOK,
      title: 'DND5E.Spellbook',
      content: {
        component: CharacterSpellbookTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_FEATURES,
      title: 'DND5E.Features',
      content: {
        component: CharacterFeaturesTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_EFFECTS,
      title: 'DND5E.Effects',
      content: {
        component: ActorEffectsTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_BIOGRAPHY,
      title: 'DND5E.Biography',
      content: {
        component: CharacterBiographyTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_JOURNAL,
      title: 'T5EK.JournalTabName',
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

  static getAllRegisteredTabs(): RegisteredActorTab<CharacterSheetContext>[] {
    return [...CharacterSheetRuntime._tabs];
  }

  static registerTab(
    tab: RegisteredActorTab<CharacterSheetContext>,
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
