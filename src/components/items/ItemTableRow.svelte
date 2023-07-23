<script lang="ts">
  import type { Actor5e } from 'src/types/actor';
  import ItemSummary from '../items/ItemSummary.svelte';
  import { warn } from 'src/utils/logging';
  import { createEventDispatcher } from 'svelte';

  export let item: any | undefined = undefined;
  export let contextMenu: { type: string; id: string } | undefined = undefined;
  export let cssClass: string = '';

  let showSummary = false;
  let chatData: any;

  async function toggleSummary(event: MouseEvent, actor: Actor5e) {
    if (!item) {
      warn('Unable to show summary. No item was provided.');
    }

    event.preventDefault();

    chatData ??= await item.getChatData({ secrets: actor.isOwner });
    showSummary = !showSummary;
  }

  const dispatcher = createEventDispatcher<{ mousedown: MouseEvent }>();
</script>

<div
  class="item-table-row {cssClass}"
  data-context-menu={contextMenu?.type}
  data-context-menu-entity-id={contextMenu?.id}
  on:mousedown={(event) => dispatcher('mousedown', event)}
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
  }
</style>
