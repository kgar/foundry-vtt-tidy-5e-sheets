<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Actor5e, EncounterSheetQuadroneContext } from 'src/types/types';

  let {
    sheetContext,
  }: {
    sheetDocument: Actor5e;
    sheetContext: EncounterSheetQuadroneContext;
  } = $props();

  let localize = FoundryAdapter.localize;
</script>

{#if sheetContext.editable}
  <!-- svelte-ignore a11y_missing_attribute -->
  <a
    role="button"
    tabindex="0"
    class="tidy-table-button"
    aria-label={localize('TIDY5E.AddSpecific', { name: localize('DND5E.Group.Member.one') })}
    data-tooltip
    data-action="browseAddNpc"
  >
    <i class="fas fa-plus"></i>
  </a>
{/if}
