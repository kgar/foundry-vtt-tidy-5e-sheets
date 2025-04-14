import type { CharacterSheetContext } from 'src/types/types';
import { ActorSheetRuntime } from '../ActorSheetRuntime.svelte';
import CharacterAttributesTab from 'src/sheets/classic/character/tabs/CharacterAttributesTab.svelte';
import CharacterBastionTab from 'src/sheets/classic/character/tabs/CharacterBastionTab.svelte';
import ActorInventoryTab from 'src/sheets/classic/actor/tabs/ActorInventoryTab.svelte';
import CharacterSpellbookTab from 'src/sheets/classic/character/tabs/CharacterSpellbookTab.svelte';
import CharacterFeaturesTab from 'src/sheets/classic/character/tabs/CharacterFeaturesTab.svelte';
import CharacterEffectsTab from 'src/sheets/classic/character/tabs/CharacterEffectsTab.svelte';
import CharacterBiographyTab from 'src/sheets/classic/character/tabs/CharacterBiographyTab.svelte';
import ActorJournalTab from 'src/sheets/classic/actor/tabs/ActorJournalTab.svelte';
import ActorActionsTab from 'src/sheets/classic/actor/tabs/ActorActionsTab.svelte';
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { RegisteredTab } from '../types';

const defaultClassicCharacterTabs: RegisteredTab<CharacterSheetContext>[] =
  [
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
      id: CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
      title: 'DND5E.Attributes',
      content: {
        component: CharacterAttributesTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_ACTOR_INVENTORY,
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
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_ACTOR_SPELLBOOK,
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
        component: CharacterEffectsTab,
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
      title: 'TIDY5E.JournalTabName',
      content: {
        component: ActorJournalTab,
        type: 'svelte',
      },
      enabled: (context) => context.owner,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_BASTION,
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
      layout: 'classic',
    },
  ];


const singleton = new ActorSheetRuntime<CharacterSheetContext>(
  defaultClassicCharacterTabs
);

export default singleton;
