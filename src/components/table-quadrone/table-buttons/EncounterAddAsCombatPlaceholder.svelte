<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getEncounterSheetQuadroneContext());
</script>

<a
  class={['tidy-table-button', { disabled: !context.editable }]}
  aria-label={FoundryAdapter.localize(
    'TIDY5E.Encounter.AddPlaceholderToCombatTracker.Label',
  )}
  data-tooltip
  data-action={context.editable ? 'addToCombatAsPlaceholder' : undefined}
>
  <i class="fa-solid fa-circle-dashed"></i>
</a>
