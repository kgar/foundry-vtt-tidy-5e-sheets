<script lang="ts">
  import type { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import TidyTableCell from '../TidyTableCell.svelte';
  import type {
    DocumentSheetQuadroneContext,
    TidySectionBase,
  } from 'src/types/types';
  import type { SectionColumnContext } from 'src/runtime/types';

  type Props = {
    columns?: ColumnsLoadout;
    columnsV2?: SectionColumnContext;
    ctx?: any;
    entry?: any;
    hiddenColumns?: Set<string>;
    section: TidySectionBase;
    context: DocumentSheetQuadroneContext<any>;
  };

  let {
    columns,
    columnsV2,
    context,
    ctx,
    entry,
    hiddenColumns = new Set(),
    section,
  }: Props = $props();
</script>

{#if columnsV2}
  {#each columnsV2.sorted as key}
    {const column = $derived(columnsV2.map[key])}
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
{:else if columns}
  {#each columns.ordered as column}
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
{/if}
