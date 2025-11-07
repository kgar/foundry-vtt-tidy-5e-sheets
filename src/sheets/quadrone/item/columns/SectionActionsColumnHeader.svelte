<script lang="ts">
  import SectionActionHeaderControl from 'src/components/item-list/controls/SectionActionHeaderControl.svelte';
  import type { ColumnHeaderProps } from 'src/runtime/types';
  import type {
    Actor5e,
    DocumentSheetQuadroneContext,
    TidySectionBase,
  } from 'src/types/types';

  let {
    section,
    sheetDocument,
  }: ColumnHeaderProps<
    Actor5e,
    DocumentSheetQuadroneContext<any>,
    TidySectionBase
  > = $props();
</script>

{#each section.sectionActions as action}
  <SectionActionHeaderControl {action} {section} {sheetDocument} />
{/each}
