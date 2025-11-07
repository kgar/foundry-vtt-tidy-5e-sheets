<script lang="ts">
  import SectionActionHeaderControl from 'src/components/item-list/controls/SectionActionHeaderControl.svelte';
  import type { ColumnHeaderProps } from 'src/runtime/types';
  import type {
    Actor5e,
    DocumentSheetQuadroneContext,
    TidySectionBase,
  } from 'src/types/types';
  import SectionActions from 'src/features/sections/SectionActions';
  import { CONSTANTS } from 'src/constants';

  let {
    section,
    sheetDocument,
  }: ColumnHeaderProps<
    Actor5e,
    DocumentSheetQuadroneContext<any>,
    TidySectionBase
  > = $props();

  const menuAction = SectionActions.getMenuActionCommand();

  const sectionActionLimit = $derived(section.rowActions.length);
</script>

{#if section.sectionActions.length <= sectionActionLimit}
  {#each section.sectionActions as action}
    <SectionActionHeaderControl {action} {section} {sheetDocument} />
  {/each}
{:else}
  <SectionActionHeaderControl
    action={menuAction}
    {section}
    {sheetDocument}
    data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_SECTION}
  />
{/if}
