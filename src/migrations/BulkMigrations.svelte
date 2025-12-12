<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Tab } from 'src/types/types';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import CcssToTidyMigration from './v3/CcssToTidyMigration.svelte';

  let selectedTabId = $state('');

  const localize = FoundryAdapter.localize;

  const tabs: Tab[] = [
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
    <div class="notice">
      {localize('TIDY5E.ReminderToBackUp')}
    </div>
  </div>

  <TabContents {tabs} {selectedTabId} cssClass="tidy-sheet-body" />
</div>

<style lang="less">
  .notice {
    display: block;
    background: var(--t5e-warning-accent-color);
    padding: 0.625rem;
    font-size: 0.75rem;
    color: var(--t5e-warning-accent-contrast-color);
    border-radius: 0.3125rem;
  }

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
