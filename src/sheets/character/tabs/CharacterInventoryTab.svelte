<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type CharacterSheetContext } from 'src/types/types';
  import ItemFilters from '../../../components/item-list/ItemFilters.svelte';
  import ItemFilterSearch from '../../../components/item-list/ItemFilterSearch.svelte';
  import ItemFilterOption from '../../../components/item-list/ItemFilterOption.svelte';
  import type { ItemLayoutMode } from 'src/types/types';
  import ItemFilterLayoutToggle from '../../../components/item-list/ItemFilterLayoutToggle.svelte';
  import InventoryList from '../parts/InventoryList.svelte';
  import InventoryGrid from '../parts/InventoryGrid.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Currency from 'src/sheets/actor/Currency.svelte';
  import Notice from '../../../components/notice/Notice.svelte';
  import NumberInput from '../../../components/inputs/NumberInput.svelte';
  import EncumbranceBar from 'src/sheets/actor/EncumbranceBar.svelte';
  import TabFooter from 'src/sheets/actor/TabFooter.svelte';
  import { settingStore } from 'src/settings/settings';
  import { CONSTANTS } from 'src/constants';
  import { ExpandAllCollapseAllService } from 'src/features/expand-collapse/ExpandAllCollapseAllService';

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
    $context.inventory.some((section: any) => section.items.length > 0) ===
    false;

  const expandAllCollapseAllService = ExpandAllCollapseAllService.initService();
</script>

<ItemFilters>
  <svelte:fragment slot="left-side-controls">
    <button
      type="button"
      on:click={() => expandAllCollapseAllService.expandAll()}
      title="Expand All"
      class="inline-icon-button"><i class="fas fa-angles-down"></i></button
    >
    <button
      type="button"
      title="Collapse All"
      on:click={() => expandAllCollapseAllService.collapseAll()}
      class="inline-icon-button"><i class="fas fa-angles-up"></i></button
    >
  </svelte:fragment>
  <ItemFilterSearch
    bind:searchCriteria
    placeholder={localize('TIDY5E.Search')}
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

<div
  class="scroll-container flex-column small-gap"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEMS_CONTAINER}
>
  {#if noItems && !$context.unlocked}
    <Notice>{localize('TIDY5E.EmptySection')}</Notice>
  {:else}
    {#each $context.inventory as section (section.label)}
      {@const filteredItems = FoundryAdapter.getFilteredItems(
        searchCriteria,
        section.items,
      )}
      {#if (searchCriteria.trim() === '' && $context.unlocked) || filteredItems.length > 0}
        {#if layoutMode === 'list'}
          <InventoryList
            primaryColumnName="{localize(
              section.label,
            )} ({filteredItems.length})"
            items={filteredItems}
            extraInventoryRowClasses={section.css}
            {section}
          />
        {:else}
          <InventoryGrid items={filteredItems} {section} />
        {/if}
      {/if}
    {/each}
  {/if}
</div>

<TabFooter mode="vertical">
  <div class="attunement-and-currency">
    <div
      class="attuned-items-counter"
      class:overattuned={$context.actor.system.attributes.attunement.value >
        $context.actor.system.attributes.attunement.max}
      title={localize('DND5E.Attunement')}
    >
      <i class="attunement-icon fas fa-sun" />
      <span
        class="attuned-items-current"
        title={localize('TIDY5E.AttunementItems')}
        >{$context.system.attributes.attunement.value}</span
      >
      /
      {#if $context.editable && FoundryAdapter.userIsGm()}
        <NumberInput
          selectOnFocus={true}
          document={$context.actor}
          field="system.attributes.attunement.max"
          cssClass="attuned-items-max"
          value={$context.system.attributes.attunement.max}
          placeholder="0"
          title={localize('TIDY5E.AttunementMax')}
          disabled={!$context.editable || $context.lockSensitiveFields}
        />
      {:else}
        <span class="attuned-items-max" title={localize('TIDY5E.AttunementMax')}
          >{$context.system.attributes.attunement.max}</span
        >
      {/if}
    </div>
    <Currency actor={$context.actor} />
  </div>

  {#if $settingStore.useCharacterEncumbranceBar}
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

      .attunement-icon {
        color: var(--t5ek-primary-accent-color);
      }

      &.overattuned {
        animation: overflowing-with-arcane-power 2s infinite;
      }

      @keyframes overflowing-with-arcane-power {
        0% {
          box-shadow: 0 0 0 0 var(--t5ek-primary-accent-color);
        }
        100% {
          box-shadow: 0 0 0 0.375rem rgba(0, 0, 0, 0);
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
