<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { InlineContainerToggleService } from 'src/features/containers/InlineContainerToggleService';
  import { settingStore } from 'src/settings/settings';
  import type { Item5e } from 'src/types/item.types';
  import { getContext } from 'svelte';

  export let inlineContainerToggleService: InlineContainerToggleService;
  export let item: Item5e;
  export let iconClass: string = '';

  let tabId = getContext<string>('tabId');

  $: inlineContainerToggleServiceStore = inlineContainerToggleService.store;
</script>

<button
  type="button"
  class="inline-container-toggle inline-transparent-button"
  on:click={() => inlineContainerToggleService.toggle(tabId, item.id)}
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.INLINE_CONTAINER_TOGGLE}
>
  {#if $inlineContainerToggleServiceStore.get(tabId)?.has(item.id)}
    <i class="fa-solid fa-box-open fa-fw {iconClass}" />
  {:else}
    <i class="fa-solid fa-box fa-fw {iconClass}" />
  {/if}
</button>
