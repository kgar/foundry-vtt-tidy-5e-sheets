<script lang="ts">
  import type { Actor5e } from 'src/types/actor';
  import ItemSummary from '../items/ItemSummary.svelte';
  import { warn } from 'src/utils/logging';
  import { createEventDispatcher, getContext } from 'svelte';
  import type { ItemCardStore } from 'src/types/types';
  import type { Writable } from 'svelte/store';
  import type {
    Item5e,
    ItemCardContentComponent,
    ItemChatData,
  } from 'src/types/item';
  import { SettingsProvider } from 'src/settings/settings';

  export let item: Item5e | null = null;
  export let contextMenu: { type: string; id: string } | null = null;
  export let cssClass: string = '';
  export let alwaysShowQuantity: boolean = false;
  export let itemCardContentTemplate: ItemCardContentComponent | null = null;

  let card = getContext<Writable<ItemCardStore>>('card');
  let showSummary = false;
  let chatData: ItemChatData;

  $: itemCardsForAllItems =
    SettingsProvider.settings.itemCardsForAllItems.get();

  async function toggleSummary(event: MouseEvent, actor: Actor5e) {
    if (!item) {
      warn('Unable to show summary. No item was provided.');
      showSummary = false;
      return;
    }

    event.preventDefault();

    chatData ??= await item.getChatData({ secrets: actor.isOwner });
    showSummary = !showSummary;
  }

  async function onMouseEnter() {
    if (!item?.getChatData || !itemCardsForAllItems) {
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

  const dispatcher = createEventDispatcher<{ mousedown: MouseEvent }>();
</script>

<div
  class="item-table-row {cssClass}"
  class:show-item-count-on-hover={!alwaysShowQuantity}
  data-context-menu={contextMenu?.type}
  data-context-menu-entity-id={contextMenu?.id}
  on:mousedown={(event) => dispatcher('mousedown', event)}
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
  role="row"
  tabindex="0"
>
  <slot {toggleSummary} />
  {#if showSummary}
    <ItemSummary {chatData} />
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
      background-color: var(--t5ek-equipped-background);
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
      box-shadow: 0 0 0 0.0625rem var(--t5ek-faint-magic-item-list-row-accent-color) inset;
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
