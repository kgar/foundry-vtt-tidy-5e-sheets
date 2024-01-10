<script lang="ts">
  import { getContext } from 'svelte';
  import SelectionListbox from '../../components/listbox/SelectionListbox.svelte';
  import type { Writable } from 'svelte/store';
  import type { TabSelectionContext } from './TabSelectionFormApplication';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  let context = getContext<Writable<TabSelectionContext>>('context');

  const apply = getContext<() => Promise<void>>('apply');
  const validate = getContext<() => boolean>('validate');
  const useDefault = getContext<() => Promise<void>>('useDefault');
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
    <h2 class="minimal" slot="left-header">
      {localize('T5EK.TabSelection.AvailableHeader')}
    </h2>
    <h2 class="minimal" slot="right-header">
      {localize('T5EK.TabSelection.SelectedHeader')}
    </h2>
  </SelectionListbox>
  <p class="flex-row align-items-center no-gap">
    <span class="extra-info-icon-container"
      ><i class="fas fa-info-circle"></i></span
    >
    <span>{localize('T5EK.TabSelection.Explanation')}</span>
  </p>
  <div class="flex-row small-gap">
    <button
      type="button"
      class="use-default-btn"
      on:click={(ev) => useDefault()}
      on:keydown={(ev) => FoundryAdapter.forceKeyboardManagerEvent(false, ev)}
      on:keyup={(ev) => FoundryAdapter.forceKeyboardManagerEvent(true, ev)}
    >
      <i class="fas fa-rotate-right" />
      {localize('T5EK.UseDefault')}
    </button>
    <button
      type="submit"
      class="save-changes-btn"
      on:click={(ev) => validate() || ev.preventDefault()}
      on:keydown={(ev) => FoundryAdapter.forceKeyboardManagerEvent(false, ev)}
      on:keyup={(ev) => FoundryAdapter.forceKeyboardManagerEvent(true, ev)}
    >
      <i class="fas fa-save" />
      {localize('T5EK.SaveChanges')}
    </button>
    <button
      type="button"
      class="apply-changes-btn"
      on:click={() => validate() && apply()}
      on:keydown={(ev) => FoundryAdapter.forceKeyboardManagerEvent(false, ev)}
      on:keyup={(ev) => FoundryAdapter.forceKeyboardManagerEvent(true, ev)}
    >
      <i class="fas fa-check" />
      {localize('T5EK.ApplyChanges')}
    </button>
  </div>
</section>

<style lang="scss">
  .extra-info-icon-container {
    width: 3.5rem;
    text-align: center;
    i {
      font-size: 1.5rem;
      color: var(--t5ek-secondary-color);
    }
  }
</style>
