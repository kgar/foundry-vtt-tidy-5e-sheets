import type { NpcSheetContext } from 'src/types/types';
import { CONSTANTS } from 'src/constants';
import NpcAbilitiesTab from 'src/sheets/npc/tabs/NpcAbilitiesTab.svelte';
import NpcSpellbookTab from 'src/sheets/npc/tabs/NpcSpellbookTab.svelte';
import NpcBiographyTab from 'src/sheets/npc/tabs/NpcBiographyTab.svelte';
import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
import ActorJournalTab from 'src/sheets/actor/tabs/ActorJournalTab.svelte';
import ActorActionsTab from 'src/sheets/actor/tabs/ActorActionsTab.svelte';
import type { SheetTabRegistrationOptions, RegisteredActorTab } from './types';
import { getOrderedEnabledSheetTabs } from './runtime-functions';
import { warn } from 'src/utils/logging';

export class NpcSheetRuntime {
  private static _tabs: RegisteredActorTab<NpcSheetContext>[] = [
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
      id: CONSTANTS.TAB_NPC_ABILITIES,
      title: 'T5EK.Abilities',
      content: {
        component: NpcAbilitiesTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_NPC_SPELLBOOK,
      title: 'DND5E.Spellbook',
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
      title: 'DND5E.Effects',
      content: {
        component: ActorEffectsTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: 'biography',
      title: 'DND5E.Biography',
      content: {
        component: NpcBiographyTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: 'journal',
      title: 'T5EK.JournalTabName',
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

  static getAllRegisteredTabs(): RegisteredActorTab<NpcSheetContext>[] {
    return [...NpcSheetRuntime._tabs];
  }

  static registerTab(
    tab: RegisteredActorTab<NpcSheetContext>,
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
