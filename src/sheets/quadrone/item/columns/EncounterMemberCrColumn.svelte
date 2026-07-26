<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    Actor5e,
    EncounterMemberCombatantQuadroneContext,
    EncounterMemberQuadroneContext,
    EncounterPlaceholderQuadroneContext,
  } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
  }: {
    rowDocument: Actor5e | undefined;
    rowContext:
      | EncounterMemberQuadroneContext
      | EncounterMemberCombatantQuadroneContext
      | EncounterPlaceholderQuadroneContext;
  } = $props();
</script>

{#if rowContext.type === 'member' && rowDocument?.system.details.cr}
  {const formattedCr = $derived(
    FoundryAdapter.formatCr(rowDocument.system.details.cr),
  )}
  <span class="cr-value font-label-large color-text-default">{formattedCr}</span
  >
{:else}
  <span class="color-text-disabled">—</span>
{/if}
