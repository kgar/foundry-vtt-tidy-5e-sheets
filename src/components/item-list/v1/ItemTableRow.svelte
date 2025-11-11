<script lang="ts">
  import { type Actor5e, type OnItemToggledFn } from 'src/types/types';
  import ItemSummary from '../ItemSummary.svelte';
  import { warn } from 'src/utils/logging';
  import { getContext, type Snippet } from 'svelte';
  import type {
    ActivityItemContext,
    ExpandedItemData,
    ExpandedItemIdToLocationsMap,
  } from 'src/types/types';
  import type { Item5e, ItemChatData } from 'src/types/item.types';
  import { CONSTANTS } from 'src/constants';
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import type { MouseEventHandler } from 'svelte/elements';

  interface Props {
    item?: Item5e | null;
    favoriteId?: string | null;
    contextMenu?: { type: string; uuid: string } | null;
    cssClass?: string;
    hidden?: boolean;
    getDragData?: (() => any) | null;
    onMouseDown?: MouseEventHandler<HTMLElement>;
    containerAttributes?: Record<string, any>;
    rowAttributes?: Record<string, any>;
    children?: Snippet<[any]>;
  }

  let {
    item = null,
    favoriteId = null,
    contextMenu = null,
    cssClass = '',
    hidden = false,
    getDragData = null,
    onMouseDown,
    containerAttributes,
    rowAttributes,
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

  async function toggleSummary(actor: Actor5e) {
    if (!item) {
      warn('Unable to show summary. No item was provided.');
      showSummary = false;
      return;
    }

    chatData = await item.getChatData({ secrets: actor.isOwner });
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

    const dragData = getDragData?.() ?? item.toDragData?.();
    if (dragData) {
      event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
    }
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
    (async function () {
      if (first) {
        first = false;
        restoreItemSummaryIfExpanded();
        return;
      }

      if (item && showSummary) {
        chatData = await item.getChatData({ secrets: item.isOwner });
      }
    })();
  });
</script>

<div
  class="item-table-row-container"
  data-item-id={item?.id}
  class:hidden
  aria-hidden={hidden}
  {...containerAttributes}
>
  <div
    class="item-table-row {cssClass ?? ''}"
    data-context-menu={contextMenu?.type}
    onmousedown={onMouseDown}
    onmouseenter={onMouseEnter}
    onmouseleave={onMouseLeave}
    ondragstart={handleDragStart}
    data-tidy-table-row
    data-tidy-draggable
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_TABLE_ROW}
    data-tidy-item-type={item?.type ?? 'unknown'}
    data-favorite-id={favoriteId ?? null}
    data-info-card={item ? 'item' : null}
    data-info-card-entity-uuid={item?.uuid ?? null}
    {...rowAttributes}
  >
    {@render children?.({ toggleSummary })}
  </div>
  {#if item}
    <ExpandableContainer expanded={showSummary}>
      <ItemSummary chatData={chatData ?? emptyChatData} {item} />
    </ExpandableContainer>
  {/if}
</div>

<style lang="less">
  .item-table-row-container {
    position: relative;
    border-radius: 0.3125rem;
    margin: 0 0 0.125rem 0.5rem;
    background: var(--t5e-faintest-color);

    &:global(.context) {
      box-shadow: 0 0 0.1875rem 0.0625rem var(--t5e-primary-accent-color) inset;
    }

    .item-table-row {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      border-radius: 0.3125rem;

      // TODO: Eliminate the CSS class injection; set the background color CSS variable via an inline style with a color taken from a function, rather than using the classes. Put the variable assignment outside of the item table row so that scripters can set the CSS variable on the row itself.
      --t5e-item-table-row-background: transparent;
      &.can-prepare.prepared {
        --t5e-item-table-row-background: var(--t5e-prepared-background);
      }

      &.method-pact.can-prepare.prepared {
        --t5e-item-table-row-background: var(--t5e-pact-background);
      }

      &.can-prepare.always {
        --t5e-item-table-row-background: var(--t5e-alwaysprepared-background);
      }

      &.method-atwill {
        --t5e-item-table-row-background: var(--t5e-atwill-background);
      }

      &.method-ritual {
        --t5e-item-table-row-background: var(--t5e-ritual-only-background);
      }

      &.method-innate {
        --t5e-item-table-row-background: var(--t5e-innate-background);
      }

      &.equipped {
        --t5e-item-table-row-background: var(--t5e-equipped-background);
      }

      &.magic-item {
        box-shadow: 0 0 0 0.0625rem var(--t5e-magic-accent-color) inset;
      }

      & {
        background: linear-gradient(
          to right,
          var(--t5e-item-table-row-background),
          transparent 120%
        );
      }
    }
  }
</style>
