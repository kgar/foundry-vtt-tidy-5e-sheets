<script lang="ts">
  import { slide } from 'svelte/transition';
  import { quadInOut } from 'svelte/easing';
  import ItemSummaryCommandButtonList from '../item-summary/ItemSummaryCommandButtonList.svelte';
  import type { Item5e } from 'src/types/item';
  import { ItemSummaryRuntime } from 'src/runtime/ItemSummaryRuntime';

  export let chatData: { description: { value: string }; properties: string[] };
  export let item: Item5e;
  export let useTransition: boolean;

  $: itemSummaryCommands = ItemSummaryRuntime.getItemSummaryCommands(item);
</script>

<div
  transition:slide={{
    duration: useTransition ? 200 : 0,
    easing: quadInOut,
  }}
  class="item-summary"
>
  {@html chatData.description.value}

  {#if itemSummaryCommands.length}
    <!-- Consider also handling the flexbox arrangement of the buttons within the button list component -->
    <div class="item-commands">
      <ItemSummaryCommandButtonList {item} />
    </div>
  {/if}

  <div class="item-properties">
    {#each chatData.properties as prop}<span class="tag">{prop}</span>{/each}
  </div>
</div>

<style lang="scss">
  .item-summary {
    flex: 0 0 100%;
    padding: 0.5rem;
    border-top: 0.0625rem solid var(--t5ek-faint-color);
    font-size: 0.75rem;

    :global(p:not(:first-child)) {
      margin-top: 0.5em;
    }
  }

  .item-commands + .item-properties {
    margin-top: 0.25rem;
  }

  .item-commands {
    display: flex;
    gap: 0.125rem;
    flex-wrap: wrap;
  }
</style>
