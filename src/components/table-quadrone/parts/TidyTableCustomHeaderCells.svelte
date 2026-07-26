<script lang="ts">
  import type {
    DocumentSheetQuadroneContext,
    TidySectionBase,
  } from 'src/types/types';
  import TidyTableHeaderCell from '../TidyTableHeaderCell.svelte';
  import type {
    ColumnSpecificationV2,
    ConfiguredColumnSpecificationV2,
    SectionColumnSpecificationsV2,
  } from 'src/types/columns.types';

  type Props = {
    hiddenColumns?: Set<string>;
    section: TidySectionBase & {
      columns: SectionColumnSpecificationsV2<
        ConfiguredColumnSpecificationV2<
          ColumnSpecificationV2<any, any, any, any, any, any>
        >
      >;
    };
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
    class={[column.header?.classes, { hidden: (!expanded && !root) || hidden }]}
    columnWidth="{column.widthRems}rem"
    data-tidy-column-key={column.key}
  >
    {#if column.header}
      <column.header.component
        {...column.header.props({
          sheetContext: context,
          sheetDocument: context.document,
        })}
      />
    {/if}
  </TidyTableHeaderCell>
{/each}
