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
  import { SettingsProvider } from 'src/settings/settings';
  import { submitText } from 'src/sheets/form';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Currency from 'src/sheets/actor/Currency.svelte';

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

<ListContainer>
  {#each $store.inventory as section (section.label)}
    {@const filteredItems = FoundryAdapter.getFilteredItems(
      searchCriteria,
      section.items
    )}
    {#if (searchCriteria.trim() === '' && allowEdit) || filteredItems.length > 0}
      {#if layoutMode === 'list'}
        <InventoryList
          primaryColumnName="{localize(section.label)} ({filteredItems.length})"
          items={filteredItems}
          extraInventoryRowClasses={section.css}
          dataset={section.dataset}
        />
      {:else}
        <InventoryGrid items={filteredItems} {section} />
      {/if}
    {/if}
  {/each}
</ListContainer>

<footer class="inventory-footer">
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
        <input
          type="number"
          class="attuned-items-max"
          data-dtype="Number"
          value={$store.system.attributes.attunement.max}
          placeholder="0"
          title={localize('T5EK.AttunementMax')}
          on:change|stopPropagation|preventDefault={(event) =>
            submitText(event, $store.actor, 'system.attributes.attunement.max')}
        />
      {:else}
        <span class="attuned-items-max"
          >{$store.system.attributes.attunement.max}</span
        >
      {/if}
    </div>
    <Currency actor={$store.actor} />
  </div>

  {#if !SettingsProvider.settings.hideStandardEncumbranceBar.get()}
    <div
      class="encumbrance"
      class:encumbered={$store.encumbrance.encumbered}
      title={localize('T5EK.Encumbrance')}
    >
      <span class="encumbrance-bar" style="width:{$store.encumbrance.pct}%" />
      <span class="encumbrance-label"
        >{$store.encumbrance.value} / {$store.encumbrance.max}</span
      >
      <i class="encumbrance-breakpoint encumbrance-33 arrow-up" />
      <i class="encumbrance-breakpoint encumbrance-33 arrow-down" />
      <i class="encumbrance-breakpoint encumbrance-66 arrow-up" />
      <i class="encumbrance-breakpoint encumbrance-66 arrow-down" />
    </div>
  {/if}
</footer>

<style lang="scss">
  .inventory-footer {
    padding-top: 0.5rem;
    margin-right: 0.875rem;
    border-top: 0.0625rem solid var(--t5e-light-color);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

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
        background: var(--t5e-faint-color);
        box-shadow: 0 0 5px var(--t5e-magic-accent) inset;
        border: 1px solid var(--t5e-magic-accent);

        &.overattuned {
          background: var(--t5e-primary-accent);
          box-shadow: 0 0 0.1875rem var(--t5e-primary-accent);
          animation: attention 2s infinite alternate ease-in-out;
          color: var(--t5e-white);
        }

        @keyframes attention {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.4);
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

        .attuned-items-max {
          width: 1.5rem;
        }

        input {
          font-size: 1rem;
          font-family: var(--t5e-signika);
        }
      }
    }

    .encumbrance {
      background: var(--t5e-light-color);
      border-radius: 0.3125rem;
      position: relative;
      box-shadow: 0 0 0 0.0625rem var(--t5e-encumbrance-outline) inset;

      .encumbrance-bar {
        position: absolute;
        top: 0.0625rem;
        --count-font: rgba(0, 0, 0, 0.9);
        left: 0.0625rem;
        bottom: 0.0625rem;
        max-width: calc(100% - 0.125rem);
        border: 0.0625rem solid var(--t5e-encumbrance-bar-outline);
        background: var(--t5e-encumbrance-bar);
        border-radius: 0.25rem;
      }

      .encumbrance-label {
        display: block;
        position: relative;
        width: 100%;
        text-align: center;
        font-weight: 700;
        color: var(--t5e-encumbrance-text);
        text-shadow: 0 0 0.125rem #000;
      }

      .encumbrance-breakpoint {
        position: absolute;
        width: 0;
        height: 0;
        transform: translateX(-50%);
        border: 0.25rem solid transparent;
      }

      .encumbrance-33 {
        left: calc(100% / 3);
      }

      .encumbrance-66 {
        left: calc((100% / 3) * 2);
      }

      .arrow-up {
        bottom: 0;
        border-bottom-color: var(--t5e-encumbrance-outline);
      }

      .arrow-down {
        top: 0;
        border-top-color: var(--t5e-encumbrance-outline);
      }
    }
  }
</style>
