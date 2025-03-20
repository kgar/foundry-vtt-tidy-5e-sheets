<script lang="ts">
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { Item5e, ItemChatData } from 'src/types/item.types';
  import type {
    ExpandedItemData,
    ExpandedItemIdToLocationsMap,
    OnItemToggledFn,
  } from 'src/types/types';
  import { warn } from 'src/utils/logging';
  import { getContext, type Snippet } from 'svelte';
  import TidyItemSummary from './TidyItemSummary.svelte';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import { RarityColors } from 'src/features/rarity-colors/RarityColors';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    item?: Item5e | null;
    contextMenu?: { type: string; uuid: string } | null;
    rowClass?: ClassValue;
    hidden?: boolean;
    draggable?: boolean;
    children?: Snippet<[{ toggleSummary: () => void; expanded: boolean }]>;
    expanded?: boolean;
  }

  let {
    item = null,
    contextMenu = null,
    rowClass = '',
    hidden = false,
    draggable = true,
    children,
    expanded = $bindable(false),
  }: Props = $props();

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
    if (!item) {
      warn('Unable to show summary. No item was provided.');
      expanded = false;
      return;
    }

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
    if (!item) {
      return;
    }

    onMouseLeave(event);

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
      expanded = true;
    }
  }

  const itemAccentColor = $derived(
    item.system.rarity
      ? `var(${RarityColors.getRarityColorVariableName(item.system.rarity)})`
      : '',
  );

  const rarityClass = $derived(item.system.rarity ? 'rarity' : '');

  let first = true;

  $effect(() => {
    (async () => {
      if (first) {
        first = false;
        restoreItemSummaryIfExpanded();
        return;
      }

      if (item && expanded) {
        chatData = await item.getChatData({ secrets: item.isOwner });
      } else if (item && !expanded && chatData) {
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
    ['data-tidy-sheet-part']: CONSTANTS.SHEET_PARTS.ITEM_TABLE_ROW,
    ['data-tidy-item-type']: item?.type ?? 'unknown',
    ['data-info-card']: item ? 'item' : null,
    ['data-info-card-entity-uuid']: item?.uuid ?? null,
    ['style']: `--t5e-use-button-border-color: ${itemAccentColor}; --t5e-item-row-color: ${itemAccentColor}`,
    draggable: draggable,
  }}
  rowClass={['tidy-table-row-v2', rowClass, rarityClass, { expanded }]}
  ondblclick={(event) => item && FoundryAdapter.editOnMouseEvent(event, item)}
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
