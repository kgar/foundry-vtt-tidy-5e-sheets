<script lang="ts">
  import type { Actor5e } from 'src/types/actor';
  import ItemSummary from '../items/ItemSummary.svelte';
  import { warn } from 'src/utils/logging';
  import { createEventDispatcher, getContext } from 'svelte';
  import type { ItemCardStore } from 'src/types/types';
  import type { Writable } from 'svelte/store';
  import type { Item5e, ItemChatData } from 'src/types/item';

  export let item: Item5e | null = null;
  export let contextMenu: { type: string; id: string } | null = null;
  export let cssClass: string = '';
  export let alwaysShowQuantity: boolean = false;

  let card = getContext<Writable<ItemCardStore>>('card');
  let showSummary = false;
  let chatData: ItemChatData;

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
    card.update((theCard) => {
      theCard.item = item;
      return theCard;
    });
  }

  async function onMouseLeave() {
    card.update((theCard) => {
      theCard.item = null;
      return theCard;
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
    background: var(--t5e-faintest-color);

    &:global(.context) {
      box-shadow: 0 0 0.1875rem 0.0625rem var(--t5e-primary-accent) inset;
    }

    &.prepared {
      background-color: var(--t5e-equipped);
    }

    &.always-prepared {
      background-color: var(--t5e-alwaysprepared);
    }

    &.pact {
      background-color: var(--t5e-pact);
    }

    &.at-will {
      background-color: var(--t5e-atwill);
    }

    &.innate {
      background-color: var(--t5e-innate);
    }

    &.equipped {
      background: var(--t5e-equipped);
    }

    &.magic-item {
      box-shadow: 0 0 0 1px var(--t5e-faint-magic-accent) inset;
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
