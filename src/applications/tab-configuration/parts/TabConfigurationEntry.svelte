<script lang="ts">
  import SelectionListbox from 'src/components/listbox/SelectionListbox.svelte';
  import type { TabConfigContextEntry } from '../tab-configuration.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    entry: TabConfigContextEntry;
  }

  let { entry }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

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
