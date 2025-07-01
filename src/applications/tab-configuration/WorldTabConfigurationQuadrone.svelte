<script lang="ts">
  import type {
    WorldTabConfigContext,
    WorldTabConfigurationQuadroneApplication,
  } from './WorldTabConfigurationQuadroneApplication.svelte';
  import type { TabStripInfo } from 'src/components/tabs/Tabs.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TabConfigurationEntry from './parts/TabConfigurationEntry.svelte';
  import VerticalTabs from 'src/components/tabs/VerticalTabs.svelte';

  interface Props {
    app: WorldTabConfigurationQuadroneApplication;
    config: WorldTabConfigContext;
  }

  let { config = $bindable(), app }: Props = $props();

  let selectedTabId = $state('');

  $effect(() => {
    if (selectedTabId === '' && tabs.length) {
      selectedTabId = tabs[0].id;
    }
  });

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

<div class="flexrow flex1">
  <div class="flexcol noflex">
    <VerticalTabs bind:selectedTabId {tabs} class="flex1" />
  </div>

  {#each config as entry, i}
    {@const tabId = getTabId(entry.documentName, entry.documentType)}
    {@const title = localize('TIDY5E.TabSelection.Title', {
      documentName: localize(
        `TYPES.${entry.documentName}.${entry.documentType}`,
      ),
    })}
    <div
      class={[
        'tidy-tab',
        { active: tabId === selectedTabId },
        'flexcol',
        'flex1',
      ]}
      data-tab-contents-for={tabId}
      role="tabpanel"
    >
      <h2>
        {title}
      </h2>
      <TabConfigurationEntry bind:entry={config[i]} />
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
  <button
    type="button"
    class="button button-secondary use-default-btn"
    onclick={() => app.useDefault()}
  >
    {localize('TIDY5E.UseDefault')}
  </button>
</div>
