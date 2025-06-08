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
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import CharacterActionsTab from 'src/sheets/quadrone/actor/tabs/CharacterActionsTab.svelte';

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
    },
    {
      title: 'DND5E.Inventory',
      content: {
        component: ActorInventoryTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_ACTOR_INVENTORY,
      layout: 'quadrone',
    },
    {
      title: 'TIDY5E.JournalTabName',
      content: {
        component: ActorJournalTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_CHARACTER_JOURNAL,
      layout: 'quadrone',
    },
    {
      title: 'DND5E.Spellbook',
      content: {
        component: ActorSpellbookTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_ACTOR_SPELLBOOK,
      layout: 'quadrone',
    },
    {
      title: 'TIDY5E.WorldSettings.TabCharacter.tabLabel',
      content: {
        component: CharacterAttributesTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
      layout: 'quadrone',
    },
    {
      title: 'DND5E.Biography',
      content: {
        component: CharacterBiographyTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_CHARACTER_BIOGRAPHY,
      layout: 'quadrone',
    },
    {
      title: 'DND5E.Features',
      content: {
        component: CharacterFeaturesTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_CHARACTER_FEATURES,
      layout: 'quadrone',
    },
    {
      title: 'DND5E.Bastion.Label',
      content: {
        component: CharacterBastionTab,
        type: 'svelte',
      },
      enabled: (context) => {
        const { enabled } = FoundryAdapter.getSystemSetting<{
          enabled: boolean;
        }>(CONSTANTS.SYSTEM_SETTING_BASTION_CONFIGURATION);
        const { basic, special } = CONFIG.DND5E.facilities.advancement;
        const threshold = Math.min(
          ...Object.keys(basic).map(Number),
          ...Object.keys(special).map(Number)
        );

        return context.actor.system.details.level >= threshold && enabled;
      },
      id: CONSTANTS.TAB_CHARACTER_BASTION,
      layout: 'quadrone',
    },
    {
      title: 'Sheet',
      content: {
        component: CharacterActionsTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_ACTOR_ACTIONS,
      layout: 'quadrone',
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
  CONSTANTS.TAB_CHARACTER_BIOGRAPHY,
  CONSTANTS.TAB_CHARACTER_BASTION,
];

const singleton = new ActorSheetRuntime<CharacterSheetQuadroneContext>(
  defaultCharacterQuadroneTabs
);

export default singleton;
