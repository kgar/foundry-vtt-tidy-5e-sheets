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

  interface Props {
    item?: Item5e | null;
    contextMenu?: { type: string; uuid: string } | null;
    rowClass?: string;
    itemCardContentTemplate?: ItemCardContentComponent | null;
    hidden?: boolean;
    children?: import('svelte').Snippet<[any]>;
  }

  let {
    item = null,
    contextMenu = null,
    rowClass = '',
    itemCardContentTemplate = null,
    hidden = false,
    children,
  }: Props = $props();

  let draggable = $derived(item);

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
  let showSummary = $state(false);
  let chatData: ItemChatData | undefined = $state();

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
  rowClass="tidy-table-row-v2 {rowClass ?? ''}"
  onmousedown={(event) =>
    item && FoundryAdapter.editOnMiddleClick(event, item)}
  onmouseenter={onMouseEnter}
  onmouseleave={onMouseLeave}
  ondragstart={handleDragStart}
>
  {@render children?.({ toggleSummary })}

  {#snippet afterRow()}
    <ExpandableContainer expanded={showSummary}>
      <ItemSummary chatData={chatData ?? emptyChatData} {item} />
    </ExpandableContainer>
  {/snippet}
</TidyTableRow>
