<script lang="ts">
  import { ItemSummaryRuntime } from 'src/runtime/ItemSummaryRuntime';
  import ItemSummaryCommandButton from './ItemSummaryCommandButton.svelte';
  import type { Item5e } from 'src/types/item';

  export let item: Item5e;

  $: itemSummaryCommands = ItemSummaryRuntime.getItemSummaryCommands(item);
</script>

{#each itemSummaryCommands as command}
  <ItemSummaryCommandButton {item} {command} />
{/each}
