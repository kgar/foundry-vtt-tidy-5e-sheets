<script lang="ts">
  import type { Actor5e } from 'src/foundry/foundry-adapter';
  import ItemSummary from '../items/ItemSummary.svelte';
  import { warn } from 'src/utils/logging';

  export let item: any | undefined = undefined;

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
</script>

<div class="item-table-row">
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
  }
</style>
