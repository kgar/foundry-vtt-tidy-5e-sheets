<script lang="ts">
  import type { ColumnHeaderProps } from 'src/runtime/types';
  import type {
    Actor5e,
    DocumentSheetQuadroneContext,
    SpellbookSection,
    TidySectionBase,
  } from 'src/types/types';

  let {
    section,
  }: ColumnHeaderProps<
    Actor5e,
    DocumentSheetQuadroneContext<any>,
    TidySectionBase | SpellbookSection
  > = $props();
</script>

{#each section.headerActions as action}
  <action.component {...action.props} />
{/each}
