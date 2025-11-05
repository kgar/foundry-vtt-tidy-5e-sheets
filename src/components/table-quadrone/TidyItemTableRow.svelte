<script module>
  export type TidyTableToggleSummaryFunction = (override?: boolean) => void;
</script>

<script lang="ts">
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { Item5e, ItemChatData } from 'src/types/item.types';
  import type {
    ExpandedItemData,
    ExpandedItemIdToLocationsMap,
    OnItemToggledFn,
  } from 'src/types/types';
  import { getContext, setContext, untrack, type Snippet } from 'svelte';
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
    children?: Snippet<
      [{ toggleSummary: TidyTableToggleSummaryFunction; expanded: boolean }]
    >;
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

  const emptyChatData: ItemChatData = {
    description: '',
    properties: [],
  };

  const expandedItemData = getContext<ExpandedItemData | undefined>(
    CONSTANTS.SVELTE_CONTEXT.EXPANDED_ITEM_DATA,
  );

  const expandedItems = getContext<ExpandedItemIdToLocationsMap | undefined>(
    CONSTANTS.SVELTE_CONTEXT.EXPANDED_ITEMS,
  );

  const onItemToggled = getContext<OnItemToggledFn | undefined>(
    CONSTANTS.SVELTE_CONTEXT.ON_ITEM_TOGGLED,
  );

  const location = getContext<string>(CONSTANTS.SVELTE_CONTEXT.LOCATION);

  let chatData: ItemChatData | undefined = $state();

  const toggleSummary: TidyTableToggleSummaryFunction = async (
    override?: boolean,
  ) => {
    chatData ??= await item.getChatData({ secrets: item.isOwner });
    expanded = override ?? !expanded;
    onItemToggled?.(item.id, expanded, location);
  };

  setContext<TidyTableToggleSummaryFunction>(
    CONSTANTS.SVELTE_CONTEXT.TIDY_TABLE_TOGGLE_SUMMARY,
    toggleSummary,
  );

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

  const config = $derived(
    item.type === CONSTANTS.ITEM_TYPE_SPELL
      ? FoundryAdapter.getSpellMethodConfig(item)
      : undefined,
  );

  const diminished = $derived(item.system.identified === false);

  const itemColorClasses = $derived<ClassValue>([
    !isNil(item.system.rarity, '') ? 'rarity' : undefined,
    diminished ? 'diminished' : item.system.rarity?.slugify(),
    !isNil(config?.key) ? 'spell-method' : undefined,
    {
      [`method-${config?.key?.slugify()}`]: !isNil(config),
    },
    'equipped' in item.system && item.system.equipped ? 'equipped' : undefined,
  ]);

  $effect(() => {
    const isExpandedAtThisLocation = expandedItems?.get(item.id)?.has(location);
    const data = expandedItemData?.get(item.id);

    if (isExpandedAtThisLocation && data) {
      untrack(() => {
        chatData = data;
        expanded = true;
      });
    }
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
    <ExpandableContainer {expanded} deferRendering>
      <TidyItemSummary chatData={chatData ?? emptyChatData} {item} />
    </ExpandableContainer>
  {/snippet}
</TidyTableRow>
