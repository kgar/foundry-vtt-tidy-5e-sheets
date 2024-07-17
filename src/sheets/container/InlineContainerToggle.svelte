<script lang="ts">
  import type { InlineContainerToggleService } from 'src/features/containers/InlineContainerToggleService';
  import { settingStore } from 'src/settings/settings';
  import type { Item5e } from 'src/types/item.types';

  export let inlineContainerToggleService: InlineContainerToggleService;
  export let item: Item5e;

  $: inlineContainerToggleServiceStore = inlineContainerToggleService.store;
</script>

<button
  type="button"
  class="inline-transparent-button"
  on:click={() => inlineContainerToggleService.toggle(item.id)}
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
>
  {#if $inlineContainerToggleServiceStore.has(item.id)}
    <i class="fa-solid fa-box-open fa-fw" />
  {:else}
    <i class="fa-solid fa-box fa-fw" />
  {/if}
</button>
