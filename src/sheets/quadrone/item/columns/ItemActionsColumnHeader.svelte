<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnHeaderProps } from 'src/runtime/item/item.types';
  import type {
    Actor5e,
    DocumentSheetQuadroneContext,
    SpellbookSection,
    TidySectionBase,
  } from 'src/types/types';
  import { getContext } from 'svelte';

  let {
    sheetContext,
    sheetDocument,
    section,
  }: ColumnHeaderProps<
    Actor5e,
    DocumentSheetQuadroneContext<any>,
    TidySectionBase | SpellbookSection
  > = $props();

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

{#if 'prepMode' in section && section.usesSlots && sheetContext.unlocked}
  <a
    aria-label={localize('DND5E.SpellSlotsConfig')}
    class="tidy-table-button"
    data-tooltip="DND5E.SpellSlotsConfig"
    onclick={() => FoundryAdapter.openSpellSlotsConfig(sheetDocument)}
  >
    <i class="fas fa-cog"></i>
  </a>
{/if}
