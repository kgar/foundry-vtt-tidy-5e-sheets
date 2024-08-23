<script lang="ts">
  import SelectionListbox from 'src/components/listbox/SelectionListbox.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let name: string;
  export let hint: string;
  export let leftHeader: string = '';
  export let leftItems: any[];
  export let rightHeader: string = '';
  export let rightItems: any[];
  export let labelProp: string;
  export let valueProp: string;

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
        <b slot="leftHeader">{localize(leftHeader)}</b>
        <b slot="rightHeader">{localize(rightHeader)}</b>
      </SelectionListbox>
      <slot name="below-listbox" />
    </div>
  </div>
</article>
