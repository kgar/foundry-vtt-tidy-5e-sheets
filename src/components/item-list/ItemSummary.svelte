<script lang="ts">
  import ItemSummaryCommandButtonList from '../item-summary/ItemSummaryCommandButtonList.svelte';
  import type { Item5e, ItemChatData } from 'src/types/item.types';
  import { ItemSummaryRuntime } from 'src/runtime/ItemSummaryRuntime';
  import HorizontalLineSeparator from '../layout/HorizontalLineSeparator.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
    import { Enrichers } from 'src/features/enrichers/Enrichers';

  interface Props {
    chatData: ItemChatData;
    item: Item5e;
  }

  let { chatData, item }: Props = $props();

  let itemSummaryCommands = $derived(
    ItemSummaryRuntime.getItemSummaryCommands(item),
  );
  let concealDetails = $derived(FoundryAdapter.concealDetails(item));

  let linked = $derived<Item5e>(item.system.linkedActivity?.item);

  const localize = FoundryAdapter.localize;
</script>

<div
  class="item-summary"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_SUMMARY}
>
  {#if linked}
    {#await FoundryAdapter.enrichHtml(Enrichers.reference(linked.uuid, linked.name)) then enriched}
      <div class="item-summary-linked-source">
        {@html localize('TIDY5E.Activities.Cast.SourceHintText', {
          itemName: enriched,
        })}
      </div>
    {/await}
    <HorizontalLineSeparator />
  {/if}

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
