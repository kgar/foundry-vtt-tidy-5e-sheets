<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { KeyedAndLabeled } from './section-order-manager.types';
  import SortingListbox from 'src/components/listbox/SortingListbox.svelte';

  export let sections: KeyedAndLabeled[];
  export let onConfirm: (sections: KeyedAndLabeled[]) => void | Promise<void>;
  export let useDefault: () => void | Promise<void>;

  const localize = FoundryAdapter.localize;
</script>

<section class="flex-column">
  <SortingListbox
    bind:items={sections}
    labelProp="label"
    valueProp="key"
    listboxCssClass="scroll-container"
    class="flex-1"
  />

  <div class="flex-row small-gap">
    <button
      type="button"
      class="use-default-btn"
      on:click={(ev) => useDefault()}
    >
      <i class="fas fa-rotate-right" />
      {localize('TIDY5E.UseDefault')}
    </button>
    <button type="button" on:click={(ev) => onConfirm(sections)}
      >{localize('TIDY5E.ButtonConfirm.Text')}</button
    >
  </div>
</section>

<style lang="scss">
  section {
    height: 100%;
    display: flex;
    flex-direction: column;

    :global(> :not(button)) {
      overflow: hidden;
    }
  }
</style>
