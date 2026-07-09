<script lang="ts">
  import type { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import type {
    DocumentSheetQuadroneContext,
    TidySectionBase,
  } from 'src/types/types';
  import TidyTableHeaderCell from '../TidyTableHeaderCell.svelte';
  import type { SectionColumnContext } from 'src/runtime/types';

  type Props = {
    columns?: ColumnsLoadout;
    columnsV2?: SectionColumnContext;
    hiddenColumns?: Set<string>;
    section: TidySectionBase;
    context: DocumentSheetQuadroneContext<any>;
    expanded?: boolean;
    root?: boolean;
  };

  let {
    columns,
    columnsV2,
    context,
    hiddenColumns = new Set(),
    section,
    expanded = true,
    root = true,
  }: Props = $props();
</script>

{#if columns}
  {#each columns.ordered as column}
    {const hidden = $derived(hiddenColumns.has(column.key))}

    <TidyTableHeaderCell
      class={[column.headerClasses, { hidden: (!expanded && !root) || hidden }]}
      columnWidth="{column.widthRems}rem"
      data-tidy-column-key={column.key}
    >
      {#if !!column.headerContent}
        {#if column.headerContent.type === 'callback'}
          {@html column.headerContent.callback?.(context.document, context)}
        {:else if column.headerContent.type === 'component'}
          <column.headerContent.component
            sheetContext={context}
            sheetDocument={context.document}
            {section}
          />
        {:else if column.headerContent.type === 'html'}
          {@html column.headerContent.html}
        {/if}
      {/if}
    </TidyTableHeaderCell>
  {/each}
{/if}

{#if columnsV2}
  <h2>COLUMNS V2</h2>
  {#each columnsV2.sorted as key}
    {const column = $derived(columnsV2.map[key])}
    {const hidden = $derived(hiddenColumns.has(column.key))}

    <TidyTableHeaderCell
      class={[column.headerClasses, { hidden: (!expanded && !root) || hidden }]}
      columnWidth="{column.widthRems}rem"
      data-tidy-column-key={column.key}
    >
      {#if !!column.headerContent}
        {#if column.headerContent.type === 'callback'}
          {@html column.headerContent.callback?.(context.document, context)}
        {:else if column.headerContent.type === 'component'}
          <column.headerContent.component
            sheetContext={context}
            sheetDocument={context.document}
            {section}
          />
        {:else if column.headerContent.type === 'html'}
          {@html column.headerContent.html}
        {/if}
      {/if}
    </TidyTableHeaderCell>
  {/each}
{/if}
