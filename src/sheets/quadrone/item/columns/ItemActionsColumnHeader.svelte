<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnHeaderProps } from 'src/runtime/item/item.types';
  import type { Actor5e, DocumentSheetQuadroneContext } from 'src/types/types';
  import { getContext } from 'svelte';

  let {
    sheetContext,
    sheetDocument,
    section,
  }: ColumnHeaderProps<Actor5e, DocumentSheetQuadroneContext<any>> = $props();

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

{#if sheetContext.editable && 'canCreate' in section && !!section.canCreate}
  <a
    class="tidy-table-button"
    title={localize('DND5E.EffectCreate')}
    onclick={onAddClicked}
  >
    <i class="fas fa-plus"></i>
  </a>
{/if}
