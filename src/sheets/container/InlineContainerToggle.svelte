<script lang="ts">
  import type { InlineContainerService } from 'src/features/inline-container/InlineContainerService';
  import type { Item5e } from 'src/types/item.types';

  export let inlineContainerService: InlineContainerService;
  export let item: Item5e;

  $: inlineContainerServiceStore = inlineContainerService.store;
</script>

<button
  type="button"
  class="inline-transparent-button"
  on:click={() => inlineContainerService.toggle(item.id)}
>
  {#if $inlineContainerServiceStore.has(item.id)}
    <i class="fa-solid fa-box-open fa-fw" />
  {:else}
    <i class="fa-solid fa-box fa-fw" />
  {/if}
</button>
