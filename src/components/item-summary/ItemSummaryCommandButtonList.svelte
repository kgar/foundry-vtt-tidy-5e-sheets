<script lang="ts">
  import { ItemSummaryRuntime } from 'src/runtime/ItemSummaryRuntime';
  import ItemSummaryCommandButton from './ItemSummaryCommandButton.svelte';
  import type { Item5e } from 'src/types/item.types';

  interface Props {
    item: Item5e;
  }

  let { item }: Props = $props();

  let itemSummaryCommands = $derived(
    ItemSummaryRuntime.getItemSummaryCommands(item),
  );
</script>

{#each itemSummaryCommands as command}
  <ItemSummaryCommandButton {item} {command} />
{/each}
