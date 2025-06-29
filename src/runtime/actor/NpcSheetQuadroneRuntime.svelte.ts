import type { NpcSheetQuadroneContext } from 'src/types/types';
import { ActorSheetQuadroneRuntime } from '../ActorSheetQuadroneRuntime.svelte';
import { CONSTANTS } from 'src/constants';
import NpcStatblockTab from 'src/sheets/quadrone/actor/tabs/NpcStatblockTab.svelte';
import ActorInventoryTab from 'src/sheets/quadrone/actor/tabs/ActorInventoryTab.svelte';
import ActorSpellbookTab from 'src/sheets/quadrone/actor/tabs/ActorSpellbookTab.svelte';
import ActorJournalTab from 'src/sheets/quadrone/actor/tabs/ActorJournalTab.svelte';
import CharacterBiographyTab from 'src/sheets/quadrone/actor/tabs/CharacterBiographyTab.svelte';
import ActorEffectsTab from 'src/sheets/quadrone/actor/tabs/ActorEffectsTab.svelte';

export const NpcSheetQuadroneRuntime =
  new ActorSheetQuadroneRuntime<NpcSheetQuadroneContext>(
    [
      {
        title: 'TIDY5E.StatblockTabName',
        content: {
          component: NpcStatblockTab,
          type: 'svelte',
        },
        id: CONSTANTS.TAB_NPC_STATBLOCK,
        layout: 'quadrone',
        iconClass: 'fa-solid fa-wreath-laurel',
      },
      {
        title: 'DND5E.Inventory',
        content: {
          component: ActorInventoryTab,
          type: 'svelte',
        },
        id: CONSTANTS.TAB_ACTOR_INVENTORY,
        layout: 'quadrone',
        iconClass: 'fa-solid fa-treasure-chest',
      },
      {
        title: 'DND5E.Spellbook',
        content: {
          component: ActorSpellbookTab,
          type: 'svelte',
        },
        id: CONSTANTS.TAB_ACTOR_SPELLBOOK,
        layout: 'quadrone',
        iconClass: 'fa-solid fa-book-sparkles',
      },
      {
        title: 'DND5E.Effects',
        content: {
          component: ActorEffectsTab,
          type: 'svelte',
        },
        id: CONSTANTS.TAB_EFFECTS,
        layout: 'quadrone',
        iconClass: 'fa-solid fa-bolt',
      },
      {
        title: 'DND5E.Biography',
        content: {
          component: CharacterBiographyTab,
          type: 'svelte',
        },
        id: CONSTANTS.TAB_ACTOR_BIOGRAPHY,
        layout: 'quadrone',
        iconClass: 'fa-solid fa-feather',
      },
      {
        title: 'TIDY5E.JournalTabName',
        content: {
          component: ActorJournalTab,
          type: 'svelte',
        },
        id: CONSTANTS.TAB_CHARACTER_JOURNAL,
        layout: 'quadrone',
        iconClass: 'fa-solid fa-notebook',
      },
    ],
    [
      CONSTANTS.TAB_NPC_STATBLOCK,
      CONSTANTS.TAB_ACTOR_INVENTORY,
      CONSTANTS.TAB_ACTOR_SPELLBOOK,
      CONSTANTS.TAB_EFFECTS,
      CONSTANTS.TAB_ACTOR_BIOGRAPHY,
      // TODO: REMOVE AFTER WORLD TAB SELECTION IS READY
      CONSTANTS.TAB_CHARACTER_JOURNAL,
    ]
  );
