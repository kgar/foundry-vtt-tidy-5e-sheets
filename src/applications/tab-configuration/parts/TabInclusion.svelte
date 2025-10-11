<script lang="ts">
  import SelectionListbox from 'src/components/listbox/SelectionListbox.svelte';
  import type { TabConfigContextEntry } from '../tab-configuration.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    entry: TabConfigContextEntry;
  }

  let { entry = $bindable() }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<SelectionListbox
  labelProp="title"
  valueProp="id"
  bind:leftItems={entry.selected}
  bind:rightItems={entry.unselected}
>
  {#snippet leftHeader()}
    <h3>{localize('TIDY5E.TabConfiguration.SelectedHeader')}</h3>
  {/snippet}
  {#snippet rightHeader()}
    <h3>{localize('TIDY5E.TabConfiguration.AvailableHeader')}</h3>
  {/snippet}
</SelectionListbox>
