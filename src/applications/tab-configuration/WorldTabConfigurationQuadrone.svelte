<script lang="ts">
  import type {
    WorldTabConfigContext,
    WorldTabConfigurationQuadroneApplication,
  } from './WorldTabConfigurationQuadroneApplication.svelte';
  import type { TabStripInfo } from 'src/components/tabs/Tabs.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import VerticalTabs from 'src/components/tabs/VerticalTabs.svelte';
  import TabbedTabConfig from './parts/TabbedTabConfig.svelte';

  interface Props {
    app: WorldTabConfigurationQuadroneApplication;
    config: WorldTabConfigContext;
  }

  let { config = $bindable(), app }: Props = $props();

  let selectedSidebarTabId = $state('');
  let selectedTabId = $state('');

  $effect(() => {
    if (selectedSidebarTabId === '' && tabs.length) {
      selectedSidebarTabId = tabs[0].id;
    }
  });

  let tabs: TabStripInfo[] = $derived(
    config.map<TabStripInfo>((c) => ({
      id: c.title.slugify(),
      title: c.title,
    })),
  );

  const localize = FoundryAdapter.localize;
</script>

<div class="dialog-content-container flexrow">
  <div class="flexcol noflex">
    <VerticalTabs bind:selectedTabId={selectedSidebarTabId} {tabs} class="flex1" />
  </div>

  {#each config as entry, i}
    {@const tabId = entry.title.slugify()}
    {@const title = localize('TIDY5E.TabConfiguration.Title', {
      documentName: entry.title,
    })}
    <div
      class={[
        'tidy-tab',
        { active: tabId === selectedSidebarTabId },
        'flexcol',
        'configuration-tab',
        'dialog-content',
      ]}
      data-tab-contents-for={tabId}
      role="tabpanel"
    >
      <h2>{title}</h2>
      <TabbedTabConfig {entry} bind:selectedTabId />
    </div>
  {/each}
</div>
<div class="button-bar">
  <button
    type="button"
    class="button button-primary save-changes-btn"
    onclick={() => app.save()}
  >
    {localize('TIDY5E.SaveChanges')}
  </button>
  <button
    type="button"
    class="button button-secondary use-default-btn"
    onclick={() => app.useDefault()}
  >
    {localize('TIDY5E.UseDefault')}
  </button>
</div>
