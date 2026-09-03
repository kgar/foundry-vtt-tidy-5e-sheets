<script lang="ts">
  import type { SectionCommand, TidySectionBase } from 'src/types/types';
  import SectionActions from 'src/features/sections/SectionActions';
  import { CONSTANTS } from 'src/constants';
  import { iterateReversed } from 'src/utils/array';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    maxRowActionsCount: number;
    section: TidySectionBase;
    sheetDocument: any;
  };

  let { maxRowActionsCount, section, sheetDocument }: Props = $props();

  const menuAction = SectionActions.getMenuActionCommand();

  // Reverse section actions so that the most important action is on the far right.
  const reversedSectionActions = $derived(
    iterateReversed(section.sectionActions),
  );
</script>

{#if section.sectionActions.length <= maxRowActionsCount}
  {#each reversedSectionActions as action}
    {@render SectionActionHeaderControl(action, action.attributes ?? {})}
  {/each}
{:else}
  {@render SectionActionHeaderControl(menuAction, {
    'data-context-menu': CONSTANTS.CONTEXT_MENU_TYPE_SECTION,
  })}
{/if}

{#snippet SectionActionHeaderControl(
  action: SectionCommand,
  attributes: HTMLAttributes<HTMLElement>,
)}
  <a
    class="tidy-table-button"
    onclick={(event) =>
      action.execute?.({ document: sheetDocument, event, section })}
    {...attributes}
  >
    {#if action.iconClass}
      <i class={action.iconClass}></i>
    {/if}
  </a>
{/snippet}
