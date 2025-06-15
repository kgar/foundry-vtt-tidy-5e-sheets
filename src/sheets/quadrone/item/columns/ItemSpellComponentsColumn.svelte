<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ColumnCellProps } from 'src/runtime/types';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
  } from 'src/types/types';

  let { rowDocument, rowContext }: ColumnCellProps = $props();

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );
</script>

{#if rowDocument.labels.components.all.length}
  <ul class="unlist spell-components">
    {#each rowDocument.labels.components.all as component}
      <li
        class={[
          'spell-component',
          { ['spell-component-special']: component.tag },
        ]}
        data-tooltip={context.spellComponentLabels[component.abbr] ??
          component.abbr}
      >
        {component.abbr}
      </li>
    {/each}
  </ul>
{:else}
  <span class="color-text-disabled">—</span>
{/if}
