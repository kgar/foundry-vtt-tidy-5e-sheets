<script lang="ts">
  import { getContext } from 'svelte';
  import SelectionListbox from '../../components/listbox/SelectionListbox.svelte';
  import type { TabSelectionContext } from './ClassicTabSelectionFormApplication.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import type ClassicTabSelectionFormApplication from './ClassicTabSelectionFormApplication.svelte';

  let context = getContext<TabSelectionContext>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const apply = getContext<ClassicTabSelectionFormApplication['apply']>(
    CONSTANTS.SVELTE_CONTEXT.APPLY,
  );
  const save = getContext<ClassicTabSelectionFormApplication['save']>('save');
  const validate = getContext<ClassicTabSelectionFormApplication['validate']>(
    CONSTANTS.SVELTE_CONTEXT.VALIDATE,
  );
  const useDefault = getContext<
    ClassicTabSelectionFormApplication['useDefault']
  >(CONSTANTS.SVELTE_CONTEXT.USE_DEFAULT);
  const localize = FoundryAdapter.localize;
</script>

<section class="tab-selection-container full-height flex-column">
  <SelectionListbox
    labelProp="label"
    valueProp="id"
    bind:leftItems={context.selected}
    bind:rightItems={context.available}
    listboxCssClass="scroll-container"
    class="flex-1"
  >
    {#snippet leftHeader()}
      <h2 class="minimal">
        {localize('TIDY5E.TabSelection.SelectedHeader')}
      </h2>
    {/snippet}
    {#snippet rightHeader()}
      <h2 class="minimal">
        {localize('TIDY5E.TabSelection.AvailableHeader')}
      </h2>
    {/snippet}
  </SelectionListbox>
  <p class="flex-row align-items-center no-gap">
    <span class="extra-info-icon-container"
      ><i class="fas fa-info-circle"></i></span
    >
    <span>{localize('TIDY5E.TabSelection.Explanation')}</span>
  </p>
  <div class="button-bar flex-row small-gap">
    <button
      type="button"
      class="use-default-btn"
      onclick={(ev) => useDefault()}
    >
      <i class="fas fa-rotate-right"></i>
      {localize('TIDY5E.UseDefault')}
    </button>
    <button
      type="button"
      class="save-changes-btn"
      onclick={(ev) => validate(context) && save(context)}
    >
      <i class="fas fa-save"></i>
      {localize('TIDY5E.SaveChanges')}
    </button>
    <button
      type="button"
      class="apply-changes-btn"
      onclick={() => validate(context) && apply(context)}
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

  .button-bar {
    button {
      flex: 1;
      min-height: 2rem;
    }
  }
</style>
