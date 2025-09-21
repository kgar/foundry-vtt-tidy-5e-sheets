<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    tooltip?: string;
  }

  let {
    tooltip = FoundryAdapter.localize('TIDY5E.Encounter.AddPlaceholder.Label'),
  }: Props = $props();

  let context = $derived(getEncounterSheetQuadroneContext());
</script>

<a
  class={['tidy-table-button', { disabled: !context.editable }]}
  aria-label={tooltip}
  data-tooltip
  onclick={(ev) => context.editable && context.sheet.onAddPlaceholder(ev)}
>
  <i class="fa-solid fa-circle-dashed"></i>
</a>
