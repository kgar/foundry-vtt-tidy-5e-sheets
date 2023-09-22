<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type ActorSheetContext } from 'src/types/types';
  import ItemFilters from '../items/ItemFilters.svelte';
  import ItemFilterSearch from '../items/ItemFilterSearch.svelte';
  import ItemFilterOption from '../items/ItemFilterOption.svelte';
  import type { ItemLayoutMode } from 'src/types/types';
  import ItemFilterLayoutToggle from '../items/ItemFilterLayoutToggle.svelte';
  import ListContainer from '../layout/ListContainer.svelte';
  import InventoryList from '../inventory/InventoryList.svelte';
  import InventoryGrid from '../inventory/InventoryGrid.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Currency from 'src/sheets/actor/Currency.svelte';
  import Notice from '../shared/Notice.svelte';
  import NumberInput from '../form/NumberInput.svelte';
  import EncumbranceBar from 'src/sheets/actor/EncumbranceBar.svelte';
  import TabFooter from 'src/sheets/actor/TabFooter.svelte';
    import { currentSettings } from 'src/settings/settings';

  let store = getContext<Readable<ActorSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  let searchCriteria: string = '';

  let layoutMode: ItemLayoutMode;
  $: layoutMode = FoundryAdapter.tryGetFlag($store.actor, 'inventory-grid')
    ? 'grid'
    : 'list';

  $: allowEdit = FoundryAdapter.tryGetFlag($store.actor, 'allow-edit');

  function toggleLayout() {
    if (layoutMode === 'grid') {
      FoundryAdapter.unsetFlag($store.actor, 'inventory-grid');
      return;
    }

    FoundryAdapter.setFlag($store.actor, 'inventory-grid', true);
  }

  $: noItems =
    $store.inventory.some((section: any) => section.items.length > 0) === false;
</script>

<ItemFilters>
  <ItemFilterSearch
    actor={$store.actor}
    bind:searchCriteria
    searchFlag="item-search"
  />
  <ItemFilterOption filterName="action" setName="inventory">
    {localize('DND5E.Action')}
  </ItemFilterOption>
  <ItemFilterOption filterName="bonus" setName="inventory">
    {localize('DND5E.BonusAction')}
  </ItemFilterOption>
  <ItemFilterOption filterName="reaction" setName="inventory">
    {localize('DND5E.Reaction')}
  </ItemFilterOption>
  <ItemFilterOption filterName="equipped" setName="inventory">
    {localize('DND5E.Equipped')}
  </ItemFilterOption>
  <ItemFilterLayoutToggle mode={layoutMode} on:toggle={() => toggleLayout()} />
</ItemFilters>

<ListContainer cssClass="flex-column small-gap">
  {#if noItems && !allowEdit}
    <Notice>{localize('T5EK.EmptySection')}</Notice>
  {:else}
    {#each $store.inventory as section (section.label)}
      {@const filteredItems = FoundryAdapter.getFilteredItems(
        searchCriteria,
        section.items
      )}
      {#if (searchCriteria.trim() === '' && allowEdit) || filteredItems.length > 0}
        {#if layoutMode === 'list'}
          <InventoryList
            primaryColumnName="{localize(
              section.label
            )} ({filteredItems.length})"
            items={filteredItems}
            extraInventoryRowClasses={section.css}
            dataset={section.dataset}
          />
        {:else}
          <InventoryGrid items={filteredItems} {section} />
        {/if}
      {/if}
    {/each}
  {/if}
</ListContainer>

<TabFooter mode="vertical">
  <div class="attunement-and-currency">
    <div
      class="attuned-items-counter"
      class:overattuned={$store.actor.system.attributes.attunement.value >
        $store.actor.system.attributes.attunement.max}
      title={localize('DND5E.Attunement')}
    >
      <i class="fas fa-sun" />
      <span class="attuned-items-current"
        >{$store.system.attributes.attunement.value}</span
      >
      /
      {#if FoundryAdapter.userIsGm()}
        <NumberInput
          document={$store.actor}
          field="system.attributes.attunement.max"
          cssClass="attuned-items-max"
          dtype="Number"
          value={$store.system.attributes.attunement.max}
          placeholder="0"
          title={localize('T5EK.AttunementMax')}
        />
      {:else}
        <span class="attuned-items-max"
          >{$store.system.attributes.attunement.max}</span
        >
      {/if}
    </div>
    <Currency actor={$store.actor} />
  </div>

  {#if !$currentSettings.hideStandardEncumbranceBar}
    <EncumbranceBar />
  {/if}
</TabFooter>

<style lang="scss">
  .attunement-and-currency {
    display: flex;
    flex: 0 0 1.875rem;
    gap: 1.25rem;

    .attuned-items-counter {
      display: flex;
      align-items: center;
      margin-left: 0.1875rem;
      padding-left: 0.625rem;
      border-radius: 0.3125rem;
      background: var(--t5ek-faint-color);
      box-shadow: 0 0 0.3125rem var(--t5ek-magic-accent-color) inset;
      border: 0.0625rem solid var(--t5ek-magic-accent-color);

      &.overattuned {
        background: var(--t5ek-primary-accent-color);
        box-shadow: 0 0 0.1875rem var(--t5ek-primary-accent-color);
        animation: attention 2s infinite alternate ease-in-out;
        color: var(--t5ek-white);
      }

      @keyframes attention {
        0% {
          transform: scale(1);
        }
        100% {
          transform: scale(1.1);
        }
      }

      span {
        font-size: 1rem;
      }

      i {
        opacity: 0.6;
        font-size: 1.25rem;
        margin-right: 0.3125rem;
        margin-left: 0.0625rem;
      }

      :global(.attuned-items-max) {
        width: 1.5rem;
      }

      :global(input) {
        font-size: 1rem;
        font-family: var(--t5ek-body-font-family);
      }
    }
  }
</style>
