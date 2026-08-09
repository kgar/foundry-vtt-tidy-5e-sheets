<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type {
    EncounterMemberCombatantQuadroneContext,
    EncounterPlaceholderQuadroneContext,
  } from 'src/types/types';

  interface Props {
    rowContext:
      | EncounterMemberCombatantQuadroneContext
      | EncounterPlaceholderQuadroneContext;
  }

  let { rowContext }: Props = $props();

  let context = $derived(getEncounterSheetQuadroneContext());

  let include = $derived(rowContext.includeInCombat);
</script>

<a
  role="button"
  tabindex="0"
  class="tidy-table-button tidy-table-toggle action-include-in-combat"
  aria-label={FoundryAdapter.localize(
    include
      ? 'TIDY5E.Encounter.Combat.IncludeInCombat.Tooltip'
      : 'TIDY5E.Encounter.Combat.ExcludeFromCombat.Tooltip',
  )}
  data-tooltip
  data-action={context.editable ? 'toggleCombatantInclusion' : undefined}
>
  {#if include}
    <i class="fa-solid fa-toggle-large-on enabled"></i>
  {:else}
    <i class="fa-solid fa-toggle-off"></i>
  {/if}
</a>
