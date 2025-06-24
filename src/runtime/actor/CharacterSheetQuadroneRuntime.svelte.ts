import type { CharacterSheetQuadroneContext } from 'src/types/types';
import { ActorSheetRuntime } from '../ActorSheetRuntime.svelte';
import type { RegisteredTab } from '../types';
import { CONSTANTS } from 'src/constants';
import ActorEffectsTab from 'src/sheets/quadrone/actor/tabs/ActorEffectsTab.svelte';
import ActorInventoryTab from 'src/sheets/quadrone/actor/tabs/ActorInventoryTab.svelte';
import ActorJournalTab from 'src/sheets/quadrone/actor/tabs/ActorJournalTab.svelte';
import ActorSpellbookTab from 'src/sheets/quadrone/actor/tabs/ActorSpellbookTab.svelte';
import CharacterAttributesTab from 'src/sheets/quadrone/actor/tabs/CharacterAttributesTab.svelte';
import CharacterBiographyTab from 'src/sheets/quadrone/actor/tabs/CharacterBiographyTab.svelte';
import CharacterFeaturesTab from 'src/sheets/quadrone/actor/tabs/CharacterFeaturesTab.svelte';
import CharacterBastionTab from 'src/sheets/quadrone/actor/tabs/CharacterBastionTab.svelte';
import CharacterActionsTab from 'src/sheets/quadrone/actor/tabs/CharacterActionsTab.svelte';
import { systemSettings } from 'src/settings/settings.svelte';

const defaultCharacterQuadroneTabs: RegisteredTab<CharacterSheetQuadroneContext>[] =
  [
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
      title: 'TIDY5E.JournalTabName',
      content: {
        component: ActorJournalTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_CHARACTER_JOURNAL,
      layout: 'quadrone',
      iconClass: 'fa-solid fa-notebook',
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
      title: 'TIDY5E.WorldSettings.TabCharacter.tabLabel',
      content: {
        component: CharacterAttributesTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
      layout: 'quadrone',
      iconClass: 'fa-solid fa-wreath-laurel',
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
      title: 'DND5E.Features',
      content: {
        component: CharacterFeaturesTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_CHARACTER_FEATURES,
      layout: 'quadrone',
      iconClass: 'fa-solid fa-cards-blank',
    },
    {
      title: 'DND5E.Bastion.Label',
      content: {
        component: CharacterBastionTab,
        type: 'svelte',
      },
      enabled: (context) => {
        const { enabled } = systemSettings.value.bastionConfiguration;
        const { basic, special } = CONFIG.DND5E.facilities.advancement;
        const threshold = Math.min(
          ...Object.keys(basic).map(Number),
          ...Object.keys(special).map(Number)
        );

        return context.actor.system.details.level >= threshold && enabled;
      },
      id: CONSTANTS.TAB_CHARACTER_BASTION,
      layout: 'quadrone',
      iconClass: 'fa-solid fa-house-turret',
    },
    {
      title: 'Sheet',
      content: {
        component: CharacterActionsTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_ACTOR_ACTIONS,
      layout: 'quadrone',
      iconClass: 'fa-solid fa-chess-knight-piece',
    },
  ];

/** Here today so I can worry about tab selection later */
export const TempDefaultCharacterQuadroneTabs = [
  CONSTANTS.TAB_ACTOR_ACTIONS,
  CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
  CONSTANTS.TAB_ACTOR_INVENTORY,
  CONSTANTS.TAB_ACTOR_SPELLBOOK,
  CONSTANTS.TAB_CHARACTER_FEATURES,
  CONSTANTS.TAB_EFFECTS,
  CONSTANTS.TAB_ACTOR_BIOGRAPHY,
  CONSTANTS.TAB_CHARACTER_BASTION,
  // TODO: REMOVE BEFORE GOING BETA
  CONSTANTS.TAB_CHARACTER_JOURNAL,
];

const singleton = new ActorSheetRuntime<CharacterSheetQuadroneContext>(
  defaultCharacterQuadroneTabs
);

export default singleton;
