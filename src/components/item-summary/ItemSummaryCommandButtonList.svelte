<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { ItemSummaryRuntime } from 'src/runtime/ItemSummaryRuntime';
  import type { Item5e } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import HorizontalLineSeparator from '../layout/HorizontalLineSeparator.svelte';
  import ItemSummaryCommandButton from './ItemSummaryCommandButton.svelte';

  interface Props {
    item: Item5e;
  }

  let { item}: Props = $props();

  // Absent when the summary renders outside an expandable table, such as an info card.
  const inlineToggleService = getContext<InlineToggleService | undefined>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );
  const tabId = getContext<string | undefined>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let context = $derived({
    inlineToggleService,
    tabId,
    containerContentsExpanded:
      !!tabId && !!inlineToggleService?.map.get(tabId)?.has(item?.id),
  });

  let itemSummaryCommands = $derived(
    ItemSummaryRuntime.getItemSummaryCommands(item, context),
  );
</script>

{#snippet buttons()}
  {#each itemSummaryCommands as command}
    <ItemSummaryCommandButton {command} {item} {context} />
  {/each}
{/snippet}

{@render buttons()}
