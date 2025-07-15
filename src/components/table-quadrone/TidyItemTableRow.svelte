<script lang="ts">
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { Item5e, ItemChatData } from 'src/types/item.types';
  import type {
    ExpandedItemData,
    ExpandedItemIdToLocationsMap,
    MessageBus,
    OnItemToggledFn,
  } from 'src/types/types';
  import { warn } from 'src/utils/logging';
  import { getContext, type Snippet } from 'svelte';
  import TidyItemSummary from './TidyItemSummary.svelte';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import type { ClassValue } from 'svelte/elements';
  import { isNil } from 'src/utils/data';
  import { isUserInteractable } from 'src/utils/element';

  interface Props {
    item: Item5e;
    contextMenu?: { type: string; uuid: string } | null;
    rowClass?: ClassValue;
    hidden?: boolean;
    children?: Snippet<[{ toggleSummary: () => void; expanded: boolean }]>;
    expanded?: boolean;
  }

  let {
    item,
    contextMenu = null,
    rowClass = '',
    hidden = false,
    children,
    expanded = $bindable(false),
  }: Props = $props();

  let messageBus = getContext<MessageBus>(CONSTANTS.SVELTE_CONTEXT.MESSAGE_BUS);

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  $effect(() => {
    if (
      messageBus.message?.message === 'expand-item' &&
      messageBus.message.tabId === tabId &&
      messageBus.message.uuid === item.uuid &&
      !expanded
    ) {
      toggleSummary();
    }
  });

  const emptyChatData: ItemChatData = {
    description: { value: '' },
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

  let chatData: ItemChatData | undefined = $state();

  async function toggleSummary() {
    chatData ??= await item.getChatData({ secrets: item.isOwner });
    expanded = !expanded;
    onItemToggled?.(item.id, expanded, location);
  }

  async function onMouseEnter(event: Event) {
    TidyHooks.tidy5eSheetsItemHoverOn(event, item);
  }

  async function onMouseLeave(event: Event) {
    TidyHooks.tidy5eSheetsItemHoverOff(event, item);
  }

  function handleDragStart(event: DragEvent) {
    onMouseLeave(event);

    if (event.target !== event.currentTarget) {
      // Allow for draggables within this containing element to be handled elsewhere.
      return;
    }

    const dragData = item.toDragData();
    event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
  }

  function restoreItemSummaryIfExpanded() {
    const isExpandedAtThisLocation = expandedItems?.get(item.id)?.has(location);

    if (isExpandedAtThisLocation) {
      chatData = expandedItemData.get(item.id);
      expanded = true;
    }
  }

  const itemColorClasses = $derived<ClassValue>([
    !isNil(item.system.rarity, '') ? 'rarity' : undefined,
    item.system.rarity?.slugify(),
    !isNil(item.system.preparation?.mode) ? 'spell-preparation' : undefined,
    {
      [`mode-${item.system.preparation?.mode?.slugify()}`]: !isNil(
        item.system.preparation?.mode,
        '',
      ),
    },
    'equipped' in item.system && item.system.equipped ? 'equipped' : undefined,
  ]);

  let first = true;

  $effect(() => {
    (async () => {
      if (first) {
        first = false;
        restoreItemSummaryIfExpanded();
        return;
      }

      if (expanded) {
        chatData = await item.getChatData({ secrets: item.isOwner });
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
    ['data-tidy-draggable']: '',
    ['data-tidy-table-row']: '',
    ['data-tidy-sheet-part']: CONSTANTS.SHEET_PARTS.ITEM_TABLE_ROW,
    ['data-tidy-item-type']: item?.type ?? 'unknown',
    ['data-info-card']: item ? 'item' : null,
    ['data-info-card-entity-uuid']: item?.uuid ?? null,
  }}
  rowClass={['tidy-table-row-v2', rowClass, itemColorClasses, { expanded }]}
  ondblclick={(event) =>
    event.target instanceof HTMLElement &&
    !isUserInteractable(event.target) &&
    item &&
    FoundryAdapter.editOnMouseEvent(event, item)}
  onmousedown={(event) => FoundryAdapter.editOnMiddleClick(event, item)}
  onmouseenter={onMouseEnter}
  onmouseleave={onMouseLeave}
  ondragstart={handleDragStart}
>
  {@render children?.({ toggleSummary, expanded })}

  {#snippet afterRow()}
    <ExpandableContainer {expanded}>
      <TidyItemSummary chatData={chatData ?? emptyChatData} {item} />
    </ExpandableContainer>
  {/snippet}
</TidyTableRow>
