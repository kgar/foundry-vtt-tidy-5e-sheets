<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type CharacterSheetContext } from 'src/types/types';
  import ItemFilters from '../../../components/item-list/ItemFilters.svelte';
  import ItemFilterSearch from '../../../components/item-list/ItemFilterSearch.svelte';
  import ItemFilterOption from '../../../components/item-list/ItemFilterOption.svelte';
  import type { ItemLayoutMode } from 'src/types/types';
  import ItemFilterLayoutToggle from '../../../components/item-list/ItemFilterLayoutToggle.svelte';
  import ListContainer from '../../../components/layout/ListContainer.svelte';
  import InventoryList from '../parts/InventoryList.svelte';
  import InventoryGrid from '../parts/InventoryGrid.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Currency from 'src/sheets/actor/Currency.svelte';
  import Notice from '../../../components/notice/Notice.svelte';
  import NumberInput from '../../../components/form/NumberInput.svelte';
  import EncumbranceBar from 'src/sheets/actor/EncumbranceBar.svelte';
  import TabFooter from 'src/sheets/actor/TabFooter.svelte';
  import { settingStore } from 'src/settings/settings';

  let context = getContext<Readable<CharacterSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  let searchCriteria: string = '';

  let layoutMode: ItemLayoutMode;
  $: layoutMode = FoundryAdapter.tryGetFlag($context.actor, 'inventory-grid')
    ? 'grid'
    : 'list';

  function toggleLayout() {
    if (layoutMode === 'grid') {
      FoundryAdapter.unsetFlag($context.actor, 'inventory-grid');
      return;
    }

    FoundryAdapter.setFlag($context.actor, 'inventory-grid', true);
  }

  $: noItems =
    $context.inventory.some((section: any) => section.items.length > 0) === false;
</script>

<ItemFilters>
  <ItemFilterSearch
    actor={$context.actor}
    bind:searchCriteria
    searchFlag="item-search"
    placeholder={localize('T5EK.SearchItem')}
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
  {#if noItems && !$context.editable}
    <Notice>{localize('T5EK.EmptySection')}</Notice>
  {:else}
    {#each $context.inventory as section (section.label)}
      {@const filteredItems = FoundryAdapter.getFilteredItems(
        searchCriteria,
        section.items
      )}
      {#if (searchCriteria.trim() === '' && $context.editable) || filteredItems.length > 0}
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
      class:overattuned={$context.actor.system.attributes.attunement.value >
        $context.actor.system.attributes.attunement.max}
      title={localize('DND5E.Attunement')}
    >
      <i class="fas fa-sun" />
      <span class="attuned-items-current"
        >{$context.system.attributes.attunement.value}</span
      >
      /
      {#if FoundryAdapter.userIsGm()}
        <NumberInput
          selectOnFocus={true}
          document={$context.actor}
          field="system.attributes.attunement.max"
          cssClass="attuned-items-max"
          value={$context.system.attributes.attunement.max}
          placeholder="0"
          title={localize('T5EK.AttunementMax')}
          disabled={!$context.owner || $context.lockSensitiveFields}
        />
      {:else}
        <span class="attuned-items-max"
          >{$context.system.attributes.attunement.max}</span
        >
      {/if}
    </div>
    <Currency actor={$context.actor} />
  </div>

  {#if !$settingStore.hideStandardEncumbranceBar}
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
