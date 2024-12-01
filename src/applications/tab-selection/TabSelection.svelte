<script lang="ts">
  import { getContext } from 'svelte';
  import SelectionListbox from '../../components/listbox/SelectionListbox.svelte';
  import type { Writable } from 'svelte/store';
  import type { TabSelectionContext } from './TabSelectionFormApplication';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Writable<TabSelectionContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const apply = getContext<() => Promise<void>>(CONSTANTS.SVELTE_CONTEXT.APPLY);
  const validate = getContext<() => boolean>(CONSTANTS.SVELTE_CONTEXT.VALIDATE);
  const useDefault = getContext<() => Promise<void>>(
    CONSTANTS.SVELTE_CONTEXT.USE_DEFAULT,
  );
  const localize = FoundryAdapter.localize;
</script>

<section class="tab-selection-container full-height flex-column">
  <SelectionListbox
    labelProp="label"
    valueProp="id"
    bind:leftItems={$context.available}
    bind:rightItems={$context.selected}
    listboxCssClass="scroll-container"
    class="flex-1"
  >
    {#snippet leftHeader()}
      <h2 class="minimal">
        {localize('TIDY5E.TabSelection.AvailableHeader')}
      </h2>
    {/snippet}
    {#snippet rightHeader()}
      <h2 class="minimal">
        {localize('TIDY5E.TabSelection.SelectedHeader')}
      </h2>
    {/snippet}
  </SelectionListbox>
  <p class="flex-row align-items-center no-gap">
    <span class="extra-info-icon-container"
      ><i class="fas fa-info-circle"></i></span
    >
    <span>{localize('TIDY5E.TabSelection.Explanation')}</span>
  </p>
  <div class="flex-row small-gap">
    <button
      type="button"
      class="use-default-btn"
      onclick={(ev) => useDefault()}
    >
      <i class="fas fa-rotate-right"></i>
      {localize('TIDY5E.UseDefault')}
    </button>
    <button
      type="submit"
      class="save-changes-btn"
      onclick={(ev) => validate() || ev.preventDefault()}
    >
      <i class="fas fa-save"></i>
      {localize('TIDY5E.SaveChanges')}
    </button>
    <button
      type="button"
      class="apply-changes-btn"
      onclick={() => validate() && apply()}
    >
      <i class="fas fa-check"></i>
      {localize('TIDY5E.ApplyChanges')}
    </button>
  </div>
</section>

<style lang="scss">
  .extra-info-icon-container {
    width: 3.5rem;
    text-align: center;
    i {
      font-size: 1.5rem;
      color: var(--t5e-secondary-color);
    }
  }
</style>
