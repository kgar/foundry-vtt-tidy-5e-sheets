<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import NpcDeathSavesMigration from './v3/NpcDeathSavesMigration.svelte';
  import CharacterBiographyMigration from './v2/CharacterBiographyMigration.svelte';
  import V1OnboardingMigration from './v1/V1OnboardingMigration.svelte';
  import type { Tab } from 'src/types/types';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import { CONSTANTS } from 'src/constants';
  import Notice from 'src/components/notice/Notice.svelte';
  import CcssToTidyMigration from './v3/CcssToTidyMigration.svelte';
  import FavoritesToSystemMigration from './v4/FavoritesToSystemMigration.svelte';
  import BondsIdealsFlawsToSystemMigration from './v5/BondsIdealsFlawsToSystemMigration.svelte';
  import SpellClassToSourceClassMigration from './v5/SpellClassToSourceClassMigration.svelte';
  import NpcExhaustionToSystemMigration from './v5/NpcExhaustionToSystemMigration.svelte';

  interface Props {
    selectedTabId?: string;
  }

  let {
    selectedTabId = $bindable(CONSTANTS.TAB_MIGRATIONS_NPC_EXHAUSTION),
  }: Props = $props();

  const localize = FoundryAdapter.localize;

  const tabs: Tab[] = [
    {
      id: CONSTANTS.TAB_MIGRATIONS_NPC_EXHAUSTION,
      title: 'TIDY5E.Settings.Migrations.NpcExhaustion.sectionTitle',
      content: {
        component: NpcExhaustionToSystemMigration,
        type: 'svelte',
      },
    },
    {
      id: CONSTANTS.TAB_MIGRATIONS_SPELL_CLASS_TO_SOURCE_CLASS,
      title: 'TIDY5E.Settings.Migrations.SpellClassToSourceClass.sectionTitle',
      content: {
        component: SpellClassToSourceClassMigration,
        type: 'svelte',
      },
    },
    {
      id: CONSTANTS.TAB_MIGRATIONS_BONDS_IDEALS_FLAWS_TO_SYSTEM,
      title: 'TIDY5E.Settings.Migrations.BondsIdealsFlawsToSystem.sectionTitle',
      content: {
        component: BondsIdealsFlawsToSystemMigration,
        type: 'svelte',
      },
    },
    {
      id: CONSTANTS.TAB_MIGRATIONS_FAVORITES_TO_SYSTEM,
      title: 'TIDY5E.Settings.Migrations.FavoritesToSystem.sectionTitle',
      content: {
        component: FavoritesToSystemMigration,
        type: 'svelte',
      },
    },
    {
      id: CONSTANTS.TAB_MIGRATIONS_CCSS_TO_TIDY,
      title: 'TIDY5E.Settings.Migrations.CcssToTidy.sectionTitle',
      content: {
        component: CcssToTidyMigration,
        type: 'svelte',
      },
    },
    {
      id: CONSTANTS.TAB_MIGRATIONS_NPC_DEATH,
      title: 'TIDY5E.Settings.Migrations.NpcDeathSaves.sectionTitle',
      content: {
        component: NpcDeathSavesMigration,
        type: 'svelte',
      },
    },
    {
      id: CONSTANTS.TAB_MIGRATIONS_CHARACTER_BIOGRAPHY,
      title: 'TIDY5E.Settings.Migrations.CharacterBiography.sectionTitle',
      content: {
        component: CharacterBiographyMigration,
        type: 'svelte',
      },
    },
    {
      id: CONSTANTS.TAB_MIGRATIONS_V1_ONBOARDING,
      title: 'TIDY5E.Settings.Migrations.v1.sectionTitle',
      content: {
        component: V1OnboardingMigration,
        type: 'svelte',
      },
    },
  ];
</script>

<div class="bulk-migrations-container">
  <div role="presentation" class="vertical-tab-container flex-column no-gap">
    <Tabs {tabs} bind:selectedTabId orientation="vertical" />
    <div role="presentation" class="remaining-vertical-space"></div>
    <Notice>
      {localize('TIDY5E.ReminderToBackUp')}
    </Notice>
  </div>

  <TabContents {tabs} {selectedTabId} cssClass="tidy-sheet-body" />
</div>

<style lang="scss">
  .bulk-migrations-container {
    height: 100%;
    display: grid;
    grid-template-areas:
      'nav    body'
      'nav    body';
    grid-template-rows: 1fr auto;
    grid-template-columns: 12.5rem 1fr;
    gap: 0.5rem;
  }

  .vertical-tab-container {
    grid-area: nav;
    margin-top: -0.5rem;
    margin-left: -0.5rem;
    margin-bottom: -0.5rem;
  }

  :global(.tidy-sheet-body) {
    grid-area: body;
    overflow-y: scroll;
    padding-top: 0.5rem;
    padding-right: 0.5rem;
    margin-right: -0.25rem;
    flex: 1;
  }

  .remaining-vertical-space {
    margin-right: -0.0625rem;
    border-right: 0.0625rem solid var(--t5e-tab-strip-border-color);
    flex: 1;
    background-color: var(--t5e-header-background);
  }
</style>
