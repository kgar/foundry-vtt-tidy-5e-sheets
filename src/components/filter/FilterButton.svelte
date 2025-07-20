<script lang="ts">
  import ButtonMenu from '../button-menu/ButtonMenu.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext, type Snippet } from 'svelte';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import FilterToggleButton from './FilterToggleButton.svelte';
  import type { ItemFilterService } from 'src/features/filtering/ItemFilterService.svelte';
  import ButtonMenuDivider from 'src/components/button-menu/ButtonMenuDivider.svelte';
  import type { ContainerSheetClassicContext } from 'src/types/item.types';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { CONSTANTS } from 'src/constants';

  interface Props {
    tabId: string;
    beforeClearButton?: Snippet;
  }

  let { tabId, beforeClearButton }: Props = $props();

  const localize = FoundryAdapter.localize;
  const context =
    $derived(
      getSheetContext<ActorSheetContextV1 | ContainerSheetClassicContext>(),
    );
  const onFilterClearAll = getContext<ItemFilterService['onFilterClearAll']>(
    CONSTANTS.SVELTE_CONTEXT.ON_FILTER_CLEAR_ALL,
  );
  let categories = $derived(context.filterData[tabId] ?? {});
  let hasActiveFilters = $derived(
    Object.entries(categories).some(([_, filters]) =>
      filters.some((f) => f.value !== null),
    ),
  );

  let menuOpen = $state(false);
</script>

<div role="presentation" class="filter-menu">
  <ButtonMenu
    iconClass="fas fa-filter"
    buttonClass="filter-menu-button {hasActiveFilters
      ? 'has-active-filters'
      : ''} {menuOpen ? 'menu-is-open' : ''}"
    position="bottom"
    anchor="right"
    title={localize('TIDY5E.ItemFilters.MenuTooltip.Filters')}
    bind:open={menuOpen}
    menuElement="div"
    buttonStyle="transparent-inline-icon"
  >
    {#each Object.entries(categories) as [category, filters]}
      <section class="filter-group">
        <h4 class="filter-group-header">
          {localize(category)}
        </h4>
        <div class="filters">
          {#each filters as filter}
            <FilterToggleButton filterGroupName={tabId} {filter}>
              {localize(filter.text)}
            </FilterToggleButton>
          {/each}
        </div>
      </section>
    {/each}

    {#if beforeClearButton}
      <ButtonMenuDivider />
      {@render beforeClearButton()}
    {/if}

    <ButtonMenuDivider />
    <section class="filter-footer flex-row justify-content-center">
      <button
        type="button"
        class="clear-all-button pill-button flex-row extra-small-gap align-items-center"
        onclick={(ev) => {
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
