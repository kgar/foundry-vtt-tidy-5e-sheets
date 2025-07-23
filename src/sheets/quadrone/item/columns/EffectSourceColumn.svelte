<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { ActiveEffect5e, ActiveEffectContext } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
    section,
  }: ColumnCellProps<ActiveEffect5e, ActiveEffectContext> = $props();
</script>

{#if rowContext.effect.source}
  <!-- TODO: this is a stopgap; use dnd5e's more sophisticated action handler for this -->
  <a
    onclick={async () =>
      (await fromUuid(rowContext.effect.source.name))?.sheet.render({
        force: true,
      })}
  >
    {rowContext.effect.source.name ?? ''}
  </a>
{:else}
  <span class="color-text-disabled"> &mdash; </span>
{/if}
