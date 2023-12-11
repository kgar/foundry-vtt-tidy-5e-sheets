import type { NpcSheetContext } from 'src/types/types';
import { CONSTANTS } from 'src/constants';
import NpcAbilitiesTab from 'src/sheets/npc/tabs/NpcAbilitiesTab.svelte';
import NpcSpellbookTab from 'src/sheets/npc/tabs/NpcSpellbookTab.svelte';
import NpcBiographyTab from 'src/sheets/npc/tabs/NpcBiographyTab.svelte';
import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
import ActorJournalTab from 'src/sheets/actor/tabs/ActorJournalTab.svelte';
import ActorActionsTab from 'src/sheets/actor/tabs/ActorActionsTab.svelte';
import type { SheetTabRegistrationOptions, SheetTabState } from './types';
import { getOrderedEnabledSheetTabs } from './state-functions';
import { warn } from 'src/utils/logging';

export class NpcSheetRuntime {
  private static _tabs: SheetTabState<NpcSheetContext>[] = [
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
      id: CONSTANTS.TAB_NPC_ABILITIES,
      displayName: 'T5EK.Abilities',
      content: {
        component: NpcAbilitiesTab,
        type: 'svelte',
      },
      enabled: true,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_NPC_SPELLBOOK,
      displayName: 'DND5E.Spellbook',
      content: {
        component: NpcSpellbookTab,
        type: 'svelte',
      },
      enabled: (context) =>
        !context.hideEmptySpellbook && context.showSpellbookTab,
      layout: 'classic',
    },
    {
      id: 'effects',
      displayName: 'DND5E.Effects',
      content: {
        component: ActorEffectsTab,
        type: 'svelte',
      },
      enabled: true,
      layout: 'classic',
    },
    {
      id: 'biography',
      displayName: 'DND5E.Biography',
      content: {
        component: NpcBiographyTab,
        type: 'svelte',
      },
      enabled: true,
      layout: 'classic',
    },
    {
      id: 'journal',
      displayName: 'T5EK.JournalTabName',
      content: {
        component: ActorJournalTab,
        type: 'svelte',
      },
      enabled: (context) => context.owner,
      layout: 'classic',
    },
  ];

  static getTabs(context: NpcSheetContext) {
    return getOrderedEnabledSheetTabs(NpcSheetRuntime._tabs, context);
  }

  static getAllRegisteredTabs(): SheetTabState<NpcSheetContext>[] {
    return [...NpcSheetRuntime._tabs];
  }

  static registerTab(
    tab: SheetTabState<NpcSheetContext>,
    options?: SheetTabRegistrationOptions
  ) {
    const tabExists = NpcSheetRuntime.getAllRegisteredTabs().some(
      (t) => t.id === tab.id
    );

    if (tabExists && !options?.overwrite) {
      warn(
        `Tab with id ${tab.id} already exists. Use option "overwrite" to replace an existing tab.`
      );
      return;
    }

    NpcSheetRuntime._tabs.push(tab);

    return NpcSheetRuntime.getAllRegisteredTabs();
  }
}
