<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Tab } from 'src/types/types';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Notice from 'src/components/notice/Notice.svelte';
  import CcssToTidyMigration from './v3/CcssToTidyMigration.svelte';
  import JournalEntryClassicToJournalEntryQuadrone from './v10/JournalEntryClassicToJournalEntryQuadrone.svelte';

  let selectedTabId = $state('');

  const localize = FoundryAdapter.localize;

  const tabs: Tab[] = [
    {
      id: 'classic-journal-to-quadrone',
      title: 'SIDEBAR.TabJournal',
      content: {
        component: JournalEntryClassicToJournalEntryQuadrone,
        type: 'svelte',
      },
    },
    {
      id: 'ccss-to-tidy',
      title: 'TIDY5E.Settings.Migrations.CcssToTidy.sectionTitle',
      content: {
        component: CcssToTidyMigration,
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

<style lang="less">
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
