<script lang="ts">
  import type { Advancement5e } from 'src/types/item.types';
  import { isNil } from 'src/utils/data';

  type Props = {
    rowDocument: Advancement5e;
  };

  let { rowDocument: advancement }: Props = $props();
</script>

{#if !isNil(advancement.value)}
  {const value = $derived(advancement.value?.toString())}
  <span class="truncate" data-tooltip={value}>
    {value}
  </span>
{:else}
  <span class="color-text-disabled">&mdash;</span>
{/if}
