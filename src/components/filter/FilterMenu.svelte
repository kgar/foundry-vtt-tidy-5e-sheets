<script lang="ts">
  import ButtonMenu from '../button-menu/ButtonMenu.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { ActorSheetContext } from 'src/types/types';
  import type { Readable } from 'svelte/store';
  import FilterToggleButton from './FilterToggleButton.svelte';
  import type { ItemFilterService } from 'src/features/filtering/ItemFilterService';
  import ButtonMenuDivider from 'src/components/button-menu/ButtonMenuDivider.svelte';

  export let filterGroupName: string;

  const localize = FoundryAdapter.localize;
  const context = getContext<Readable<ActorSheetContext>>('context');
  const onFilterClearAll =
    getContext<ItemFilterService['onFilterClearAll']>('onFilterClearAll');
  $: filters = $context.actorItemFilterData[filterGroupName];
  $: hasActiveFilters = filters.some((f) => f.value !== null);

  $: menuOpen = false;
</script>

<div role="presentation" class="filter-menu">
  <ButtonMenu
    iconClass="fas fa-filter"
    buttonClass="inline-icon-button filter-menu-button {hasActiveFilters
      ? 'has-active-filters'
      : ''}"
    position="bottom"
    anchor="right"
    title={localize('TIDY5E.ItemFilters.MenuTooltip.NoActiveFilters')}
    bind:open={menuOpen}
  >
    <section class="filter-section">
      {#each filters as filter (filter.text)}
        <FilterToggleButton {filterGroupName} {filter}>
          {localize(filter.text)}
        </FilterToggleButton>
      {/each}
    </section>
    <ButtonMenuDivider />
    <section class="filter-footer flex-row justify-content-center">
      <button
        type="button"
        class="clear-all-button flex-row extra-small-gap align-items-center"
        on:click={(ev) => {
          onFilterClearAll(filterGroupName);
          menuOpen = false;
        }}
        ><i class="fas fa-filter-slash"></i>
        {localize('TIDY5E.ItemFilters.ClearAll')}</button
      >
    </section>
  </ButtonMenu>
</div>

<style lang="scss">
  .filter-menu {
    display: contents;

    :global(.filter-menu-button.has-active-filters) {
      color: var(--t5e-primary-accent-color);
    }
  }

  .filter-section {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  section {
    padding: 0.25rem 0.5rem;
  }

  // TODO: In _buttons.scss, create the pill-button and inline-pill-button classes ;)
  .clear-all-button {
    flex: 1;
    border-color: var(--t5e-faint-color);
    border-radius: 0.3125rem;

    // i {
    font-size: 0.75rem;
    // }
  }
</style>
