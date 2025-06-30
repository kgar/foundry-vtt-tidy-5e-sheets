<script lang="ts">
  import SelectionListbox from 'src/components/listbox/SelectionListbox.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Snippet } from 'svelte';

  interface Props {
    name: string;
    hint: string;
    leftHeaderText?: string;
    leftItems: any[];
    rightHeaderText?: string;
    rightItems: any[];
    labelProp: string;
    valueProp: string;
    belowListbox?: Snippet;
  }

  let {
    name,
    hint,
    leftHeaderText = '',
    leftItems = $bindable(),
    rightHeaderText = '',
    rightItems = $bindable(),
    labelProp,
    valueProp,
    belowListbox,
  }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<article class="setting group">
  <div class="description flex-1">
    <b>{localize(name)}</b>
    <p>
      {localize(hint)}
    </p>
    <div class="flex-column small-gap">
      <SelectionListbox bind:leftItems bind:rightItems {labelProp} {valueProp}>
        {#snippet leftHeader()}
          <h3>{localize(leftHeaderText)}</h3>
        {/snippet}
        {#snippet rightHeader()}
          <h3>{localize(rightHeaderText)}</h3>
        {/snippet}
      </SelectionListbox>
      {@render belowListbox?.()}
    </div>
  </div>
</article>
