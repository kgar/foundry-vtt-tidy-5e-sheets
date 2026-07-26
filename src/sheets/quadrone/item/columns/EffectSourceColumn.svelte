<script lang="ts">
  import type { ActiveEffectContext } from 'src/types/types';

  type Props = {
    rowContext: ActiveEffectContext;
  };

  let { rowContext }: Props = $props();
</script>

{#if rowContext.source}
  <a data-action="showDocument" data-uuid={rowContext.source?.uuid}>
    {rowContext.source.name ?? ''}
  </a>
{:else}
  <span class="color-text-disabled"> &mdash; </span>
{/if}
