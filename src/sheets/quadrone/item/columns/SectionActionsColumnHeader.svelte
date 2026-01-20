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
  import { iterateReversed } from 'src/utils/array';

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

  // Reverse section actions so that the most important action is on the far right.
  const reversedSectionActions = $derived(
    iterateReversed(section.sectionActions),
  );
</script>

{#if section.sectionActions.length <= sectionActionLimit}
  {#each reversedSectionActions as action}
    <SectionActionHeaderControl
      {action}
      {section}
      {sheetDocument}
      {...action.attributes}
    />
  {/each}
{:else}
  <SectionActionHeaderControl
    action={menuAction}
    {section}
    {sheetDocument}
    data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_SECTION}
  />
{/if}
