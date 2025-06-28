import { ActorSheetRuntime } from '../ActorSheetRuntime.svelte';
import ActorInventoryTab from 'src/sheets/classic/actor/tabs/ActorInventoryTab.svelte';
import NpcAbilitiesTab from 'src/sheets/classic/npc/tabs/NpcAbilitiesTab.svelte';
import NpcSpellbookTab from 'src/sheets/classic/npc/tabs/NpcSpellbookTab.svelte';
import NpcBiographyTab from 'src/sheets/classic/npc/tabs/NpcBiographyTab.svelte';
import NpcEffectsTab from 'src/sheets/classic/npc/tabs/NpcEffectsTab.svelte';
import ActorJournalTab from 'src/sheets/classic/actor/tabs/ActorJournalTab.svelte';
import ActorActionsTab from 'src/sheets/classic/actor/tabs/ActorActionsTab.svelte';
import SpecialTraitsTab from 'src/sheets/classic/actor/tabs/SpecialTraitsTab.svelte';
import { CONSTANTS } from 'src/constants';
import type { RegisteredTab } from '../types';
import type { NpcSheetContext } from 'src/types/types';

const defaultNpcClassicTabs: RegisteredTab<NpcSheetContext>[] = [
  {
    title: 'TIDY5E.Actions.TabName',
    content: {
      component: ActorActionsTab,
      type: 'svelte',
    },
    id: CONSTANTS.TAB_ACTOR_ACTIONS,
    layout: 'classic',
  },
  {
    id: CONSTANTS.TAB_NPC_ABILITIES,
    title: 'TIDY5E.Abilities',
    content: {
      component: NpcAbilitiesTab,
      type: 'svelte',
    },
    layout: 'classic',
  },
  {
    id: CONSTANTS.TAB_ACTOR_SPELLBOOK,
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
      component: NpcEffectsTab,
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
    title: 'TIDY5E.JournalTabName',
    content: {
      component: ActorJournalTab,
      type: 'svelte',
    },
    enabled: (context) => context.owner,
    layout: 'classic',
  },
  {
    id: 'inventory',
    title: 'DND5E.Inventory',
    content: {
      component: ActorInventoryTab,
      type: 'svelte',
      getProps() {
        return {
          tabId: CONSTANTS.TAB_ACTOR_INVENTORY,
        };
      },
    },
    enabled: (context) => context.owner,
    layout: 'classic',
  },
  {
    id: CONSTANTS.TAB_ACTOR_SPECIAL_TRAITS,
    title: 'DND5E.SpecialTraits',
    content: {
      component: SpecialTraitsTab,
      type: 'svelte',
    },
    layout: 'classic',
    iconClass: 'fa-solid fa-star',
  },
];

const singleton = new ActorSheetRuntime<NpcSheetContext>(
  defaultNpcClassicTabs,
  []
);

export default singleton;
