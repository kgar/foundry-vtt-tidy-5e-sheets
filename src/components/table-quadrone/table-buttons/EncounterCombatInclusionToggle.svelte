<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type {
    EncounterMemberQuadroneContext,
    EncounterPlaceholderQuadroneContext,
  } from 'src/types/types';

  interface Props {
    rowContext:
      | EncounterMemberQuadroneContext
      | EncounterPlaceholderQuadroneContext;
  }

  let { rowContext }: Props = $props();

  const localize = FoundryAdapter.localize;

  let context = $derived(getEncounterSheetQuadroneContext());

  let identifier = $derived(
    rowContext.type === 'member'
      ? rowContext.actor.uuid
      : rowContext.id,
  );

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
  onclick={() => context.sheet.toggleCombatantInclusion(identifier)}
  onkeypress={(ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      context.sheet.toggleCombatantInclusion(identifier);
    }
  }}
>
  {#if include}
    <i class="fa-solid fa-toggle-large-on enabled"></i>
  {:else}
    <i class="fa-solid fa-toggle-off"></i>
  {/if}
</a>
