<script lang="ts">
  import SectionActionHeaderControl from 'src/components/item-list/controls/SectionActionHeaderControl.svelte';
  import type { ColumnHeaderProps } from 'src/runtime/types';
  import type {
    Actor5e,
    DocumentSheetQuadroneContext,
    TidySectionBase,
  } from 'src/types/types';
  import SectionActions from 'src/features/sections/SectionActions';

  let {
    section,
    sheetDocument,
  }: ColumnHeaderProps<
    Actor5e,
    DocumentSheetQuadroneContext<any>,
    TidySectionBase
  > = $props();

  const menuAction = SectionActions.getMenuActionCommand();
</script>

{#if section.sectionActions.length <= 3}
  {#each section.sectionActions as action}
    <SectionActionHeaderControl {action} {section} {sheetDocument} />
  {/each}
{:else}
  <SectionActionHeaderControl action={menuAction} {section} {sheetDocument} />
{/if}
