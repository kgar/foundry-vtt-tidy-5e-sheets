<script lang="ts">
  import TidyTableRow from 'src/components/table/TidyTableRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { Item5e, ItemChatData } from 'src/types/item.types';
  import type {
    ExpandedItemData,
    ExpandedItemIdToLocationsMap,
    OnItemToggledFn,
  } from 'src/types/types';
  import { warn } from 'src/utils/logging';
  import { getContext, type Snippet } from 'svelte';
  import ItemSummary from '../ItemSummary.svelte';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { TidyHooks } from 'src/foundry/TidyHooks';

  interface Props {
    item?: Item5e | null;
    contextMenu?: { type: string; uuid: string } | null;
    rowClass?: string;
    hidden?: boolean;
    children?: Snippet<[any]>;
  }

  let {
    item = null,
    contextMenu = null,
    rowClass = '',
    hidden = false,
    children,
  }: Props = $props();

  const emptyChatData: ItemChatData = {
    description: '',
    properties: [],
  };

  const expandedItemData = getContext<ExpandedItemData>(
    CONSTANTS.SVELTE_CONTEXT.EXPANDED_ITEM_DATA,
  );

  const expandedItems = getContext<ExpandedItemIdToLocationsMap>(
    CONSTANTS.SVELTE_CONTEXT.EXPANDED_ITEMS,
  );

  const onItemToggled = getContext<OnItemToggledFn>(
    CONSTANTS.SVELTE_CONTEXT.ON_ITEM_TOGGLED,
  );

  const location = getContext<string>(CONSTANTS.SVELTE_CONTEXT.LOCATION);

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
  }

  async function onMouseLeave(event: Event) {
    TidyHooks.tidy5eSheetsItemHoverOff(event, item);
  }

  function handleDragStart(event: DragEvent) {
    if (!item) {
      return;
    }

    onMouseLeave(event);

    if (event.target !== event.currentTarget) {
      // Allow for draggables within this containing element to be handled elsewhere.
      return;
    }

    const dragData = item.toDragData();
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

  let first = true;

  $effect(() => {
    (async () => {
      if (first) {
        first = false;
        restoreItemSummaryIfExpanded();
        return;
      }

      if (item && showSummary) {
        chatData = await item.getChatData({ secrets: item.isOwner });
      } else if (item && !showSummary && chatData) {
        // Reset chat data for non-expanded, hydrated chatData
        // so it rehydrates on next open
        chatData = undefined;
      }
    })();
  });
</script>

<TidyTableRow
  {hidden}
  rowContainerAttributes={{
    ['data-item-id']: item?.id,
  }}
  rowAttributes={{
    ['data-context-menu']: contextMenu?.type,
    ['data-tidy-table-row']: '',
    ['data-tidy-draggable']: '',
    ['data-tidy-sheet-part']: CONSTANTS.SHEET_PARTS.ITEM_TABLE_ROW,
    ['data-tidy-item-type']: item?.type ?? 'unknown',
    ['data-info-card']: item ? 'item' : null,
    ['data-info-card-entity-uuid']: item?.uuid ?? null,
  }}
  rowClass="tidy-table-row-v2 {rowClass ?? ''}"
  onmousedown={(event) => item && FoundryAdapter.editOnMiddleClick(event, item)}
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
