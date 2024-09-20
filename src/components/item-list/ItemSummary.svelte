<script lang="ts">
  import ItemSummaryCommandButtonList from '../item-summary/ItemSummaryCommandButtonList.svelte';
  import type { Item5e, ItemChatData } from 'src/types/item.types';
  import { ItemSummaryRuntime } from 'src/runtime/ItemSummaryRuntime';
  import HorizontalLineSeparator from '../layout/HorizontalLineSeparator.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';

  export let chatData: ItemChatData;
  export let item: Item5e;

  $: itemSummaryCommands = ItemSummaryRuntime.getItemSummaryCommands(item);
  $: concealDetails = FoundryAdapter.concealDetails(item);
</script>

<div
  class="item-summary"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_SUMMARY}
>
  {@html chatData.description}

  {#if itemSummaryCommands.length}
    <HorizontalLineSeparator />
    <div class="inline-wrapped-elements">
      <ItemSummaryCommandButtonList {item} />
    </div>
  {/if}

  {#if chatData.properties}
    <HorizontalLineSeparator />
    <div
      class="inline-wrapped-elements"
      inert={concealDetails}
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_PROPERTY_LIST}
    >
      {#each chatData.properties as prop}<span class="tag">{prop}</span>{/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .item-summary {
    flex: 0 0 100%;
    padding-top: var(--item-summary-padding-top, 0);
    padding-right: var(--item-summary-padding-right, 0.5rem);
    padding-bottom: var(--item-summary-padding-bottom, 0.25rem);
    padding-left: var(--item-summary-padding-left, 0.5rem);
    border-top: 0.0625rem solid var(--t5e-faint-color);
    font-size: 0.75rem;

    :global(p:not(:first-child)) {
      margin-top: 0.5em;
    }

    :global(.horizontal-line-separator) {
      margin-left: -0.5rem;
      margin-right: -0.5rem;
    }
  }

  .inline-wrapped-elements {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }

  .inline-wrapped-elements:last-of-type {
    margin-bottom: 0;
  }
</style>
