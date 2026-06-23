<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    TabConfig,
    TabConfigContextEntry,
  } from 'src/settings/editors/shared/tab-configuration.types';
  import SortableListbox from './SortableListbox.svelte';
  import FieldToggle from 'src/components/toggles/FieldToggle.svelte';
  import { CONSTANTS } from 'src/constants';
  import { VisibilityLevels } from 'src/features/visibility-levels/VisibilityLevels';
  import { listboxSnippets } from './SortableListboxSnippets.svelte';

  type Props = {
    tabConfigEntry: TabConfigContextEntry;
  };

  let { tabConfigEntry }: Props = $props();

  const visibilityLevels = $derived(
    VisibilityLevels.getOptions(tabConfigEntry.documentName),
  );

  const localize = FoundryAdapter.localize;
</script>

{#snippet listboxItemName(item: TabConfig)}
  {@render listboxSnippets.primaryHeader(item.id, item.title)}
{/snippet}
{#snippet listboxItemVisibility(item: TabConfig)}
  {#if item.show}
    <select
      class="tab-viewers-button"
      title={localize('TIDY5E.TabConfiguration.options.viewers')}
      bind:value={item.visibilityLevel}
    >
      {#each visibilityLevels as option (option.key)}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  {/if}
{/snippet}
{#snippet listboxItemShow(item: TabConfig)}
  {const canConfigureViewers = $derived(
    FoundryAdapter.userIsGm() ||
      item.visibilityLevel !== CONSTANTS.VISIBILITY_LEVEL_GM,
  )}
  <div class="tab-visibility-switch">
    <FieldToggle
      checked={item.show}
      onchange={(ev) => {
        item.show = (ev.currentTarget as HTMLInputElement).checked;
      }}
      disabled={!canConfigureViewers}
    />
  </div>
{/snippet}

<SortableListbox
  items={tabConfigEntry.tabs}
  columns={[
    {
      title: 'TIDY5E.TabConfiguration.headers.tab',
      titleClasses: 'tabs-label',
      cellSnippet: listboxItemName,
    },
    {
      title: 'TIDY5E.TabConfiguration.headers.userVisibility',
      titleClasses: 'viewers-label',
      cellSnippet: listboxItemVisibility,
    },
    {
      title: 'TIDY5E.TabConfiguration.headers.showTab',
      titleClasses: 'visibility-label',
      cellSnippet: listboxItemShow,
    },
  ]}
  listItemClassesFn={(item) => ({ 'marked-as-hidden': !item.show })}
  key="id"
  orderConfig={{
    getOrder: (item) => item.order,
    setOrder: (item, value) => {
      item.order = value;
    },
  }}
/>
