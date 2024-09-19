<script lang="ts">
  import TidyTableRow from 'src/components/table/TidyTableRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { settingStore } from 'src/settings/settings';
  import type {
    Item5e,
    ItemCardContentComponent,
    ItemChatData,
  } from 'src/types/item.types';
  import type {
    ExpandedItemData,
    ExpandedItemIdToLocationsMap,
    OnItemToggledFn,
    ItemCardStore,
  } from 'src/types/types';
  import { warn } from 'src/utils/logging';
  import { getContext, onMount } from 'svelte';
  import type { Writable } from 'svelte/store';
  import ItemSummary from '../ItemSummary.svelte';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import InlineActivitiesList from '../InlineActivitiesList.svelte';

  export let item: Item5e | null = null;
  export let contextMenu: { type: string; uuid: string } | null = null;
  export let rowClass: string = '';
  export let itemCardContentTemplate: ItemCardContentComponent | null = null;
  export let hidden: boolean = false;

  $: draggable = item;

  const emptyChatData: ItemChatData = {
    description: { value: '' },
    properties: [],
    unidentified: { description: '' },
  };

  const expandedItemData = getContext<ExpandedItemData>(
    CONSTANTS.SVELTE_CONTEXT.EXPANDED_ITEM_DATA,
  );
  const context = getContext<Writable<unknown>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  const expandedItems = getContext<ExpandedItemIdToLocationsMap>(
    CONSTANTS.SVELTE_CONTEXT.EXPANDED_ITEMS,
  );
  const onItemToggled = getContext<OnItemToggledFn>(
    CONSTANTS.SVELTE_CONTEXT.ON_ITEM_TOGGLED,
  );
  const location = getContext<string>(CONSTANTS.SVELTE_CONTEXT.LOCATION);

  let card: Writable<ItemCardStore> | undefined = getContext<
    Writable<ItemCardStore>
  >(CONSTANTS.SVELTE_CONTEXT.CARD);
  let showSummary = false;
  let chatData: ItemChatData | undefined;

  async function toggleSummary() {
    if (!item) {
      warn('Unable to show summary. No item was provided.');
      showSummary = false;
      return;
    }

    chatData ??= await item.getChatData({ secrets: item.isOwner });
    showSummary = !showSummary;
    onItemToggled?.(item.id, showSummary, location);
  }

  async function onMouseEnter(event: Event) {
    TidyHooks.tidy5eSheetsItemHoverOn(event, item);

    if (!item?.getChatData || !$settingStore.itemCardsForAllItems) {
      return;
    }

    card?.update((card) => {
      card.item = item;
      card.itemCardContentTemplate = itemCardContentTemplate;
      return card;
    });
  }

  async function onMouseLeave(event: Event) {
    TidyHooks.tidy5eSheetsItemHoverOff(event, item);

    card?.update((card) => {
      card.item = null;
      card.itemCardContentTemplate = null;
      return card;
    });
  }

  function handleDragStart(event: DragEvent) {
    if (!draggable) {
      return;
    }

    // Don't show cards while dragging
    onMouseLeave(event);

    card?.update((card) => {
      return card;
    });

    const dragData = draggable.toDragData();
    event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
  }

  function restoreItemSummaryIfExpanded() {
    if (!item) {
      return;
    }

    const isExpandedAtThisLocation = expandedItems?.get(item.id)?.has(location);

    if (isExpandedAtThisLocation) {
      chatData = expandedItemData.get(item.id);
      showSummary = true;
    }
  }

  onMount(() => {
    let first = true;

    const subscription = context?.subscribe(async (c: any) => {
      if (first) {
        first = false;
        restoreItemSummaryIfExpanded();
        return;
      }

      if (item && showSummary) {
        chatData = await item.getChatData({ secrets: item.actor.isOwner });
      } else if (item && !showSummary && chatData) {
        // Reset chat data for non-expanded, hydrated chatData
        // so it rehydrates on next open
        chatData = undefined;
      }
    });

    return subscription;
  });
</script>

<div style="display: contents;" class="item-table-row">
  <TidyTableRow
    {hidden}
    rowContainerAttributes={{
      ['data-context-menu']: contextMenu?.type,
      ['data-context-menu-document-uuid']: contextMenu?.uuid,
      ['data-item-id']: item?.id,
      ['data-tidy-table-row']: '',
      ['data-tidy-sheet-part']: CONSTANTS.SHEET_PARTS.ITEM_TABLE_ROW,
      ['data-tidy-item-type']: item?.type ?? 'unknown',
    }}
    rowAttributes={{
      draggable: !!draggable,
    }}
    {rowClass}
    on:mousedown={(event) =>
      item && FoundryAdapter.editOnMiddleClick(event, item)}
    on:mouseenter={onMouseEnter}
    on:mouseleave={onMouseLeave}
    on:dragstart={handleDragStart}
  >
    <slot {toggleSummary} />

    <svelte:fragment slot="after-row">
      <ExpandableContainer expanded={showSummary}>
        <ItemSummary chatData={chatData ?? emptyChatData} {item} />
      </ExpandableContainer>
    </svelte:fragment>
  </TidyTableRow>
</div>

<style lang="scss">
  .item-table-row {
    :global(.tidy-table-row.prepared) {
      --t5e-tidy-table-row-background: var(--t5e-prepared-background);
    }

    :global(.tidy-table-row.always-prepared) {
      --t5e-tidy-table-row-background: var(--t5e-alwaysprepared-background);
    }

    :global(.tidy-table-row.pact) {
      --t5e-tidy-table-row-background: var(--t5e-pact-background);
    }

    :global(.tidy-table-row.at-will) {
      --t5e-tidy-table-row-background: var(--t5e-atwill-background);
    }

    :global(.tidy-table-row.ritual-only) {
      --t5e-tidy-table-row-background: var(--t5e-ritual-only-background);
    }

    :global(.tidy-table-row.innate) {
      --t5e-tidy-table-row-background: var(--t5e-innate-background);
    }

    :global(.tidy-table-row.equipped) {
      --t5e-tidy-table-row-background: var(--t5e-equipped-background);
    }

    :global(.tidy-table-row.magic-item) {
      box-shadow: 0 0 0 0.0625rem var(--t5e-magic-accent-color) inset;
    }
  }
</style>
