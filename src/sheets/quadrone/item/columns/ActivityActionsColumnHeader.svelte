<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnHeaderProps } from 'src/runtime/types';
  import type {
    Actor5e,
    DocumentSheetQuadroneContext,
    TidySectionBase,
  } from 'src/types/types';
  import { getContext } from 'svelte';

  type Props = {
    editable: boolean;
    maxRowActionsCount: number;
    section: TidySectionBase;
    sheetDocument: any;
  };

  let { editable, maxRowActionsCount, section, sheetDocument }: Props =
    $props();

  let localize = FoundryAdapter.localize;

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  function onAddClicked() {
    sheetDocument.sheet._addDocument({
      tabId,
      customSection: section.custom?.section,
      creationItemTypes: section.custom?.creationItemTypes,
      data: { type: section.key, ...section.dataset },
    });
  }
</script>

<!-- TODO: Upgrade to use full section actions feature -->
{#if editable && 'canCreate' in section && !!section.canCreate}
  <a
    class="tidy-table-button"
    aria-label={localize('DND5E.ACTIVITY.Action.Create')}
    data-tooltip
    onclick={onAddClicked}
  >
    <i class="fas fa-plus"></i>
  </a>
{/if}
