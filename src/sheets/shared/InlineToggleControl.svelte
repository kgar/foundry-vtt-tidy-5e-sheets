<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService';
  import { settingStore } from 'src/settings/settings';
  import type { Item5e } from 'src/types/item.types';
  import { getContext } from 'svelte';

  export let inlineToggleService: InlineToggleService;
  export let entityId: Item5e;
  export let iconClass: string = '';

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  $: inlineContainerToggleServiceStore = inlineToggleService.store;
</script>

<button
  type="button"
  class="inline-toggle inline-transparent-button px-1"
  on:click={() => inlineToggleService.toggle(tabId, entityId)}
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.INLINE_CONTAINER_TOGGLE}
>
  <i
    class="fa-solid fa-angle-right expand-indicator {iconClass}"
    class:expanded={$inlineContainerToggleServiceStore
      .get(tabId)
      ?.has(entityId)}
  ></i>
</button>
