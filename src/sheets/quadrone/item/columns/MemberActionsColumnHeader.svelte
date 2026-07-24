<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    Actor5e,
    EncounterSheetQuadroneContext,
    SpellbookSection,
    TidySectionBase,
  } from 'src/types/types';
  import type { ColumnHeaderProps } from 'src/types/columns.types';

  let {
    sheetContext,
    sheetDocument,
    section: _,
  }: ColumnHeaderProps<
    Actor5e,
    EncounterSheetQuadroneContext,
    TidySectionBase | SpellbookSection
  > = $props();

  let localize = FoundryAdapter.localize;

  function onAddClicked() {
    sheetDocument.sheet._browseAddNpc();
  }
</script>

{#if sheetContext.editable}
  <a
    class="tidy-table-button"
    aria-label={localize('TIDY5E.Encounter.AddMember.Label')}
    data-tooltip
    onclick={onAddClicked}
  >
    <i class="fas fa-plus"></i>
  </a>
{/if}
