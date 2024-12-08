<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { settings } from 'src/settings/settings.svelte';
  import type { Item5e } from 'src/types/item.types';
  import { getContext } from 'svelte';

  interface Props {
    inlineToggleService: InlineToggleService;
    entityId: Item5e;
    iconClass?: string;
  }

  let { inlineToggleService, entityId, iconClass = '' }: Props = $props();

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let toggleServiceMap = $derived(inlineToggleService.map);
</script>

<button
  type="button"
  class="inline-toggle inline-transparent-button px-1"
  onclick={() => inlineToggleService.toggle(tabId, entityId)}
  tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.INLINE_CONTAINER_TOGGLE}
>
  <i
    class="fa-solid fa-angle-right expand-indicator {iconClass}"
    class:expanded={toggleServiceMap.get(tabId)?.has(entityId)}
  ></i>
</button>
