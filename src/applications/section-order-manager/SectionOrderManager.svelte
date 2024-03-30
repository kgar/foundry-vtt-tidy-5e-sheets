<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { KeyedAndLabeled } from './section-order-manager.types';
  import SortingListbox from 'src/components/listbox/SortingListbox.svelte';

  export let sections: KeyedAndLabeled[];
  export let onConfirm: (sections: KeyedAndLabeled[]) => void | Promise<void>;

  const localize = FoundryAdapter.localize;
</script>

<section class="flex-column">
  <SortingListbox bind:items={sections} labelProp="label" valueProp="key" class="flex-1" />

  <button type="button" on:click={(ev) => onConfirm(sections)}
    >{localize('TIDY5E.ButtonConfirm.Text')}</button
  >
</section>

<style lang="scss">
    section {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>
