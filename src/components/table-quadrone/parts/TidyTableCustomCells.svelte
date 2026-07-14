<script lang="ts">
  import TidyTableCell from '../TidyTableCell.svelte';
  import type {
    DocumentSheetQuadroneContext,
    TidySectionBase,
  } from 'src/types/types';

  type Props = {
    ctx?: any;
    entry?: any;
    hiddenColumns?: Set<string>;
    section: TidySectionBase;
    context: DocumentSheetQuadroneContext<any>;
  };

  let {
    context,
    ctx,
    entry,
    hiddenColumns = new Set(),
    section,
  }: Props = $props();
</script>

{#each section.columns.sorted as key}
  {const column = $derived(section.columns.map[key])}
  {const hidden = $derived(hiddenColumns.has(column.key))}

  <TidyTableCell
    columnWidth="{column.widthRems}rem"
    class={[column.cellClasses, { hidden }]}
    attributes={{ ['data-tidy-column-key']: column.key }}
  >
    {#if column.cellContent.type === 'callback'}
      {@html column.cellContent.callback?.(context.document, context)}
    {:else if column.cellContent.type === 'component'}
      <column.cellContent.component
        rowContext={ctx}
        rowDocument={entry}
        {section}
      />
    {/if}
  </TidyTableCell>
{/each}
