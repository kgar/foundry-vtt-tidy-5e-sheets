<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type CharacterSheetContext } from 'src/types/types';
  import ItemFilters from '../items/ItemFilters.svelte';
  import ItemFilterSearch from '../items/ItemFilterSearch.svelte';
  import ItemFilterOption from '../items/ItemFilterOption.svelte';
  import type { ItemLayoutMode, SheetFunctions } from 'src/types/types';
  import ItemFilterLayoutToggle from '../items/ItemFilterLayoutToggle.svelte';
  import ListContainer from '../layout/ListContainer.svelte';
  import FilteredItems from '../items/FilteredItems.svelte';
  import InventoryList from '../inventory/InventoryList.svelte';
  import InventoryGrid from '../inventory/InventoryGrid.svelte';

  export let context: CharacterSheetContext;
  export let sheetFunctions: SheetFunctions;

  const localize = FoundryAdapter.localize;

  let searchCriteria: string = '';

  const layoutMode: ItemLayoutMode = FoundryAdapter.tryGetFlag(
    context.actor,
    'inventory-grid'
  )
    ? 'grid'
    : 'list';
  const allowEdit = FoundryAdapter.tryGetFlag(context.actor, 'allow-edit');

  function toggleLayout() {
    if (layoutMode === 'grid') {
      FoundryAdapter.unsetFlag(context.actor, 'inventory-grid');
      return;
    }

    FoundryAdapter.setFlag(context.actor, 'inventory-grid', true);
  }

  const currencies = Object.entries(context.system.currency).map((e) => ({
    key: e[0],
    value: e[1],
  }));

  function confirmConvertCurrency() {
    return Dialog.confirm({
      title: `${localize('DND5E.CurrencyConvert')}`,
      content: `<p>${localize('DND5E.CurrencyConvertHint')}</p>`,
      yes: () => context.actor.convertCurrency(),
    });
  }

  function abbreviateCurrency(currencyKey: string) {
    let currency = currencyKey.toUpperCase();

    let abbr = localize(`DND5E.CurrencyAbbr${currency}`);
    if (abbr == `DND5E.CurrencyAbbr${currency}`) {
      abbr = currency;
    }

    return abbr;
  }
</script>

<ItemFilters>
  <ItemFilterSearch
    actor={context.actor}
    bind:searchCriteria
    searchFlag="item-search"
  />
  <ItemFilterOption filterName="action" setName="inventory" {sheetFunctions}>
    {localize('DND5E.Action')}
  </ItemFilterOption>
  <ItemFilterOption filterName="bonus" setName="inventory" {sheetFunctions}>
    {localize('DND5E.BonusAction')}
  </ItemFilterOption>
  <ItemFilterOption filterName="reaction" setName="inventory" {sheetFunctions}>
    {localize('DND5E.Reaction')}
  </ItemFilterOption>
  <ItemFilterOption filterName="equipped" setName="inventory" {sheetFunctions}>
    {localize('DND5E.Equipped')}
  </ItemFilterOption>
  <ItemFilterLayoutToggle mode={layoutMode} on:toggle={() => toggleLayout()} />
</ItemFilters>

<ListContainer>
  {#each context.inventory as section}
    <FilteredItems {searchCriteria} items={section.items} let:filteredItems>
      {#if (searchCriteria.trim() === '' && allowEdit) || filteredItems.length > 0}
        {#if layoutMode === 'list'}
          <InventoryList items={filteredItems} {section} {context} />
        {:else}
          <InventoryGrid items={filteredItems} {section} {context} />
        {/if}
      {/if}
    </FilteredItems>
  {/each}
</ListContainer>

<footer class="inventory-footer">
  <div class="attunement-and-currency">
    <div
      class="attuned-items-counter"
      class:overattuned={context.actor.system.attributes.attunement.value >
        context.actor.system.attributes.attunement.max}
      title={localize('DND5E.Attunement')}
    >
      <i class="fas fa-sun" />
      <span class="attuned-items-current"
        >{context.system.attributes.attunement.value}</span
      >
      /
      {#if FoundryAdapter.userIsGm()}
        <input
          type="number"
          class="attuned-items-max"
          name="system.attributes.attunement.max"
          value={context.system.attributes.attunement.max}
          placeholder="0"
          title={localize('TIDY5E.AttunementMax')}
        />
      {:else}
        <span class="attuned-items-max"
          >{context.system.attributes.attunement.max}</span
        >
      {/if}
    </div>
    <div class="inventory-currency">
      <ol class="currency">
        <li class="currency-header" title={localize('DND5E.Currency')}>
          <i class="fas fa-coins" />
        </li>
        {#each currencies as currency}
          <li
            class="currency-item {currency.key}"
            title={context.labels.currencies[currency.key]}
          >
            <input
              type="number"
              step="any"
              name="system.currency.{currency.key}"
              id="{context.appId}-system.currency.{currency.key}"
              value={currency.value}
            />
            <label
              for="{context.appId}-system.currency.{currency.key}"
              class="denomination {currency.key}"
              data-denom={currency.key}
              >{abbreviateCurrency(currency.key)}</label
            >
          </li>
        {/each}
        <li class="currency-item convert">
          <a
            class="currency-convert"
            role="button"
            title={localize('DND5E.CurrencyConvertHint')}
            on:click|stopPropagation|preventDefault={() =>
              confirmConvertCurrency()}
          >
            <i class="fas fa-funnel-dollar" />
          </a>
        </li>
      </ol>
    </div>
  </div>

  <div
    class="encumbrance"
    class:encumbered={context.encumbrance.encumbered}
    title={localize('TIDY5E.Encumbrance')}
  >
    <span class="encumbrance-bar" style="width:{context.encumbrance.pct}%" />
    <span class="encumbrance-label"
      >{context.encumbrance.value} / {context.encumbrance.max}</span
    >
    <i class="encumbrance-breakpoint encumbrance-33 arrow-up" />
    <i class="encumbrance-breakpoint encumbrance-33 arrow-down" />
    <i class="encumbrance-breakpoint encumbrance-66 arrow-up" />
    <i class="encumbrance-breakpoint encumbrance-66 arrow-down" />
  </div>
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

      .inventory-currency {
        .currency {
          display: flex;
          align-items: center;
          list-style: none;
          gap: 0.5rem;

          .currency-header {
            flex: 0 0 0.8125rem;
            text-align: center;

            i {
              font-size: 1.25rem;
            }
          }

          .currency-item {
            display: flex;
            align-items: center;
            background: var(--t5e-faint-color);
            border-radius: 0.3125rem;
            line-height: 1.875rem;
            padding-right: 0.5rem;

            input {
              text-align: right;
              flex: 1;
              padding-left: 0.5rem;
            }

            label {
              margin-left: 0.25rem;
              flex: 0 0 auto;
            }

            &.convert {
              padding: 0;
              flex: 0 0 0.0625rem;
              text-align: center;
              white-space: nowrap;
            }

            a {
              // display: block;
              background: var(--t5e-tertiary-color);
              color: var(--t5e-background);
              border-radius: 0.3125rem;
              padding: 0 0.375rem;

              &:hover {
                background: var(--t5e-secondary-color);
              }
            }

            .denomination {
              text-transform: uppercase;
            }
          }
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
