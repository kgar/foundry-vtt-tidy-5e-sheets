<script lang="ts">
  import type { SectionColumnSpecificationsV2 } from 'src/types/columns.types';
  import TidyTableCell from '../TidyTableCell.svelte';
  import type {
    DocumentSheetQuadroneContext,
    TidySectionBase,
  } from 'src/types/types';

  type Props = {
    ctx?: any;
    entry?: any;
    hiddenColumns?: Set<string>;
    section: Omit<TidySectionBase, 'columns'> & {
      columns: SectionColumnSpecificationsV2;
    };
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
    class={[column.cell.classes, { hidden }]}
    attributes={{ ['data-tidy-column-key']: column.key }}
  >
    <column.cell.component
      {...column.cell.props({
        sheetDocument: context.document,
        sheetContext: context,
        rowDocument: entry,
        rowContext: ctx,
      })}
    />
  </TidyTableCell>
{/each}
