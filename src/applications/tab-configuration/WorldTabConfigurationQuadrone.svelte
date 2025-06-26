<script lang="ts">
  import type { Tab } from 'src/types/types';
  import type {
    WorldTabConfigContext,
    WorldTabConfigurationQuadroneApplication,
  } from './WorldTabConfigurationQuadroneApplication.svelte';
  import type { TabStripInfo } from 'src/components/tabs/Tabs.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    app: WorldTabConfigurationQuadroneApplication;
    config: WorldTabConfigContext;
  }

  let { config, app }: Props = $props();

  let selectedTabId = $state('');

  function getTabId(documentName: string, documentType: string) {
    return `${documentName}-${documentType}`;
  }

  let tabs: TabStripInfo[] = $derived(
    config.map<TabStripInfo>((c) => ({
      id: getTabId(c.documentName, c.documentType),
      title: c.title,
    })),
  );

  const localize = FoundryAdapter.localize;
</script>

<div class="flexcol">
  <div class="flexrow">
    <Tabs bind:selectedTabId {tabs} />

    {#each config as entry}
      {@const tabId = getTabId(entry.documentName, entry.documentType)}
      <div
        class={['tidy-tab', { active: tabId === selectedTabId }]}
        data-tab-contents-for={tabId}
        role="tabpanel"
      >
        Hello {JSON.stringify(entry)}
      </div>
    {/each}
  </div>
  <div class="flexrow flex0">
    <button
      type="button"
      class="button button-primary save-changes-btn"
      onclick={() => app.save()}
    >
      {localize('TIDY5E.SaveChanges')}
    </button>
    <!-- <button type="button" class="button" onclick={() => app.apply()}
      >{localize('TIDY5E.ApplyChanges')}</button
      > -->
    <button
      type="button"
      class="button button-secondary use-default-btn"
      onclick={() => app.useDefault()}
    >
      {localize('TIDY5E.UseDefault')}
    </button>
  </div>
</div>
