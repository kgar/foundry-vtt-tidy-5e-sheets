<script lang="ts">
  import type { Actor5e } from 'src/foundry/foundry-adapter';
  import ItemSummary from '../shared/ItemSummary.svelte';

  export let item: any;

  let showSummary = false;
  let chatData: any;

  async function toggleSummary(event: MouseEvent, actor: Actor5e) {
    event.preventDefault();

    chatData ??= await item.getChatData({ secrets: actor.isOwner });
    showSummary = !showSummary;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="item-table-row" tabindex="0" role="button">
  <slot {toggleSummary} />
</div>
{#if showSummary}
  <ItemSummary {chatData} />
{/if}
