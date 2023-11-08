<script lang="ts">
  import { type Actor5e, type OnItemToggledFn } from 'src/types/types';
  import ItemSummary from '../item-list/ItemSummary.svelte';
  import { warn } from 'src/utils/logging';
  import { createEventDispatcher, getContext, onMount } from 'svelte';
  import type {
    ItemCardStore,
    ExpandedItemData,
    LocationAwareExpandedItems,
  } from 'src/types/types';
  import type { Writable } from 'svelte/store';
  import type {
    Item5e,
    ItemCardContentComponent,
    ItemChatData,
  } from 'src/types/item';
  import { settingStore } from 'src/settings/settings';

  export let item: Item5e | null = null;
  export let contextMenu: { type: string; id: string } | null = null;
  export let cssClass: string = '';
  export let itemCardContentTemplate: ItemCardContentComponent | null = null;

  const expandedItemData = getContext<ExpandedItemData>(
    'expandedItemData'
  );
  const expandedItems = getContext<LocationAwareExpandedItems>('expandedItems');
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

  async function onMouseEnter() {
    if (!item?.getChatData || !$settingStore.itemCardsForAllItems) {
      return;
    }

    card.update((card) => {
      card.item = item;
      card.itemCardContentTemplate = itemCardContentTemplate;
      return card;
    });
  }

  async function onMouseLeave() {
    card.update((card) => {
      card.item = null;
      card.itemCardContentTemplate = null;
      return card;
    });
  }

  function handleDragStart(event: DragEvent) {
    if (!item) {
      return;
    }

    const dragData = item.toDragData();
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
    restoreItemSummaryIfExpanded();
  });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="item-table-row {cssClass}"
  class:show-item-count-on-hover={!$settingStore.quantityAlwaysShownEnabled}
  data-context-menu={contextMenu?.type}
  data-context-menu-entity-id={contextMenu?.id}
  on:mousedown={(event) => dispatcher('mousedown', event)}
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
  draggable={!!item}
  on:dragstart={handleDragStart}
  data-item-id={item?.id}
>
  <slot {toggleSummary} />
  {#if showSummary && chatData}
    <ItemSummary {chatData} {useTransition} />
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
