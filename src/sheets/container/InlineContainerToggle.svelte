<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { InlineContainerToggleService } from 'src/features/containers/InlineContainerToggleService';
  import type { Item5e } from 'src/types/item.types';
  import { getContext } from 'svelte';

  export let inlineContainerToggleService: InlineContainerToggleService;
  export let item: Item5e;
  export let iconClass: string = '';

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  $: inlineContainerToggleServiceStore = inlineContainerToggleService.store;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<a
  class="inline-container-toggle inline-transparent-button inline-flex-row align-items-center"
  on:click={() => inlineContainerToggleService.toggle(tabId, item.id)}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.INLINE_CONTAINER_TOGGLE}
>
  {#if $inlineContainerToggleServiceStore.get(tabId)?.has(item.id)}
    <i class="fa-solid fa-box-open fa-fw {iconClass}" />
  {:else}
    <i class="fa-solid fa-box fa-fw {iconClass}" />
  {/if}
</a>
