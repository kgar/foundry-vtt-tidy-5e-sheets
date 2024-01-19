<script lang="ts">
  import { type Actor5e, type OnItemToggledFn } from 'src/types/types';
  import ItemSummary from '../item-list/ItemSummary.svelte';
  import { warn } from 'src/utils/logging';
  import { createEventDispatcher, getContext, onMount } from 'svelte';
  import type {
    ItemCardStore,
    ExpandedItemData,
    ExpandedItemIdToLocationsMap,
  } from 'src/types/types';
  import type { Writable } from 'svelte/store';
  import type {
    Item5e,
    ItemCardContentComponent,
    ItemChatData,
  } from 'src/types/item';
  import { settingStore } from 'src/settings/settings';
  import { CONSTANTS } from 'src/constants';

  export let item: Item5e | null = null;
  export let effect: any | null = null;
  export let contextMenu: { type: string; id: string } | null = null;
  export let cssClass: string = '';
  export let itemCardContentTemplate: ItemCardContentComponent | null = null;

  $: draggable = item ?? effect;

  const expandedItemData = getContext<ExpandedItemData>('expandedItemData');
  const context = getContext<Writable<unknown>>('context');
  const expandedItems =
    getContext<ExpandedItemIdToLocationsMap>('expandedItems');
  const onItemToggled = getContext<OnItemToggledFn>('onItemToggled');
  const dispatcher = createEventDispatcher<{ mousedown: MouseEvent }>();
  const location = getContext<string>('location');

  let card = getContext<Writable<ItemCardStore>>('card');
  let showSummary = false;
  let chatData: ItemChatData | undefined;
  let useTransition: boolean = false;

  async function toggleSummary(actor: Actor5e) {
    if (!item) {
      warn('Unable to show summary. No item was provided.');
      showSummary = false;
      return;
    }

    chatData ??= await item.getChatData({ secrets: actor.isOwner });
    showSummary = !showSummary;
    onItemToggled?.(item.id, showSummary, location);
  }

  async function onMouseEnter(event: Event) {
    Hooks.callAll(CONSTANTS.HOOK_TIDY5E_SHEETS_ITEM_HOVER_ON, event, item);

    if (!item?.getChatData || !$settingStore.itemCardsForAllItems) {
      return;
    }

    card.update((card) => {
      card.item = item;
      card.itemCardContentTemplate = itemCardContentTemplate;
      return card;
    });
  }

  async function onMouseLeave(event: Event) {
    Hooks.callAll(CONSTANTS.HOOK_TIDY5E_SHEETS_ITEM_HOVER_OFF, event, item);

    card.update((card) => {
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

    card.update((card) => {
      return card;
    });

    const dragData = draggable.toDragData();
    event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
  }

  function restoreItemSummaryIfExpanded() {
    if (!item) {
      useTransition = true;
      return;
    }

    useTransition = false;

    const isExpandedAtThisLocation = expandedItems?.get(item.id)?.has(location);

    if (isExpandedAtThisLocation) {
      chatData = expandedItemData.get(item.id);
      showSummary = true;
    }

    setTimeout(() => {
      useTransition = true;
    });
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
        item
          .getChatData({ secrets: item.actor.isOwner })
          .then((data: ItemChatData) => {
            chatData = data;
          });
      } else if (item && !showSummary && chatData) {
        // Reset chat data for non-expanded, hydrated chatData
        // so it rehydrates on next open
        chatData = undefined;
      }
    });

    return subscription;
  });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="item-table-row {cssClass}"
  class:show-item-count-on-hover={!$settingStore.alwaysShowItemQuantity}
  data-context-menu={contextMenu?.type}
  data-context-menu-entity-id={contextMenu?.id}
  on:mousedown={(event) => dispatcher('mousedown', event)}
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
  on:dragstart={handleDragStart}
  draggable={!!draggable}
  data-item-id={item?.id}
  data-tidy-item-table-row
>
  <slot {toggleSummary} />
  {#if showSummary && chatData}
    <ItemSummary {chatData} {useTransition} {item} />
  {/if}
</div>

<style lang="scss">
  .item-table-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    position: relative;
    border-radius: 0.3125rem;
    margin: 0.125rem 0 0.125rem 0.5rem;
    background: var(--t5ek-faintest-color);

    &:global(.context) {
      box-shadow: 0 0 0.1875rem 0.0625rem var(--t5ek-primary-accent-color) inset;
    }

    &.prepared {
      background-color: var(--t5ek-prepared-background);
    }

    &.always-prepared {
      background-color: var(--t5ek-alwaysprepared-background);
    }

    &.pact {
      background-color: var(--t5ek-pact-background);
    }

    &.at-will {
      background-color: var(--t5ek-atwill-background);
    }

    &.innate {
      background-color: var(--t5ek-innate-background);
    }

    &.equipped {
      background: var(--t5ek-equipped-background);
    }

    &.magic-item {
      box-shadow: 0 0 0 0.0625rem
        var(--t5ek-faint-magic-item-list-row-accent-color) inset;
    }

    &.show-item-count-on-hover :global(.item-quantity) {
      opacity: 0;
      width: 0;
      transition: opacity 0.3s ease;
    }

    &.show-item-count-on-hover:hover :global(.item-quantity),
    &.show-item-count-on-hover :global(.item-quantity:focus-within) {
      width: auto;
      opacity: 1;
    }
  }
</style>
