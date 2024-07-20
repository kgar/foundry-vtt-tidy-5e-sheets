<script lang="ts">
  import ButtonMenu from '../button-menu/ButtonMenu.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { ActorSheetContext } from 'src/types/types';
  import type { Readable } from 'svelte/store';
  import FilterToggleButton from './FilterToggleButton.svelte';
  import type { ItemFilterService } from 'src/features/filtering/ItemFilterService';
  import ButtonMenuDivider from 'src/components/button-menu/ButtonMenuDivider.svelte';
  import type { ContainerSheetContext } from 'src/types/item.types';
  import { CONSTANTS } from 'src/constants';

  export let tabId: string;

  const localize = FoundryAdapter.localize;
  const context = getContext<
    Readable<ActorSheetContext | ContainerSheetContext>
  >(CONSTANTS.SVELTE_CONTEXT.CONTEXT);
  const onFilterClearAll =
    getContext<ItemFilterService['onFilterClearAll']>('onFilterClearAll');
  $: categories = $context.filterData[tabId] ?? {};
  $: hasActiveFilters = Object.entries(categories).some(([_, filters]) =>
    filters.some((f) => f.value !== null),
  );

  $: menuOpen = false;
</script>

<div role="presentation" class="filter-menu">
  <ButtonMenu
    iconClass="fas fa-filter"
    buttonClass="inline-icon-button filter-menu-button {hasActiveFilters
      ? 'has-active-filters'
      : ''} {menuOpen ? 'menu-is-open' : ''}"
    position="bottom"
    anchor="right"
    title={localize('TIDY5E.ItemFilters.MenuTooltip.Filters')}
    bind:open={menuOpen}
    menuElement="div"
  >
    {#each Object.entries(categories) as [category, filters] (category)}
      <section class="filter-group">
        <h4 class="filter-group-header">
          {localize(category)}
        </h4>
        <div class="filters">
          {#each filters as filter (filter.text)}
            <FilterToggleButton filterGroupName={tabId} {filter}>
              {localize(filter.text)}
            </FilterToggleButton>
          {/each}
        </div>
      </section>
    {/each}
    <ButtonMenuDivider />
    <section class="filter-footer flex-row justify-content-center">
      <button
        type="button"
        class="clear-all-button pill-button flex-row extra-small-gap align-items-center"
        on:click={(ev) => {
          onFilterClearAll(tabId);
          menuOpen = false;
        }}
      >
        <i class="fas fa-filter-slash"></i>
        {localize('TIDY5E.ItemFilters.ClearAll')}</button
      >
    </section>
  </ButtonMenu>
</div>
