<script lang="ts">
  import SelectionListbox from 'src/components/listbox/SelectionListbox.svelte';
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

<div class="flexrow flex1">
  <Tabs bind:selectedTabId {tabs} orientation="vertical" cssClass="noflex" />

  {#each config as entry}
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
      <SelectionListbox
        labelProp="title"
        valueProp="id"
        bind:leftItems={entry.unselected}
        bind:rightItems={entry.selected}
      >
        {#snippet leftHeader()}
          <b>{localize('TIDY5E.TabSelection.AvailableHeader')}</b>
        {/snippet}
        {#snippet rightHeader()}
          <b>{localize('TIDY5E.TabSelection.SelectedHeader')}</b>
        {/snippet}
      </SelectionListbox>
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
