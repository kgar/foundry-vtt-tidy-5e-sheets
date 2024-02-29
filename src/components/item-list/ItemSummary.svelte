<script lang="ts">
  import { slide } from 'svelte/transition';
  import { quadInOut } from 'svelte/easing';
  import ItemSummaryCommandButtonList from '../item-summary/ItemSummaryCommandButtonList.svelte';
  import type { Item5e, ItemChatData } from 'src/types/item';
  import { ItemSummaryRuntime } from 'src/runtime/ItemSummaryRuntime';
  import HorizontalLineSeparator from '../layout/HorizontalLineSeparator.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let chatData: ItemChatData;
  export let item: Item5e;
  export let useTransition: boolean;

  $: itemSummaryCommands = ItemSummaryRuntime.getItemSummaryCommands(item);
  $: concealDetails = FoundryAdapter.concealDetails(item);
</script>

<div
  transition:slide={{
    duration: useTransition ? 200 : 0,
    easing: quadInOut,
  }}
  class="item-summary"
>
  {#if concealDetails}
    {@html chatData.unidentified.description}
  {:else}
    {@html chatData.description.value}
  {/if}

  {#if itemSummaryCommands.length}
    <HorizontalLineSeparator />
    <div class="item-properties">
      <ItemSummaryCommandButtonList {item} />
    </div>
  {/if}

  {#if chatData.properties}
    <HorizontalLineSeparator />
    <div class="item-properties" inert={concealDetails}>
      {#each chatData.properties as prop}<span class="tag">{prop}</span>{/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .item-summary {
    flex: 0 0 100%;
    padding: 0 0.5rem 0.5rem 0.5rem;
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

  .item-properties {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }

  .item-properties:last-of-type {
    margin-bottom: 0;
  }
</style>
