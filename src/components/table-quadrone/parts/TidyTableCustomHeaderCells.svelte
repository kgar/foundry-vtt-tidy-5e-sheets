<script lang="ts">
  import type {
    DocumentSheetQuadroneContext,
    TidySectionBase,
  } from 'src/types/types';
  import TidyTableHeaderCell from '../TidyTableHeaderCell.svelte';

  type Props = {
    hiddenColumns?: Set<string>;
    section: TidySectionBase;
    context: DocumentSheetQuadroneContext<any>;
    expanded?: boolean;
    root?: boolean;
  };

  let {
    context,
    hiddenColumns = new Set(),
    section,
    expanded = true,
    root = true,
  }: Props = $props();
</script>

{#each section.columns.sorted as key}
  {const column = $derived(section.columns.map[key])}
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
