<script lang="ts">
  import type {
    Actor5e,
    EncounterMemberCombatantQuadroneContext,
    EncounterMemberQuadroneContext,
    EncounterPlaceholderQuadroneContext,
  } from 'src/types/types';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { CombatantSettings } from 'src/features/combat/CombatantSettings';
  import { isNil } from 'src/utils/data';

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

  let context = $derived(getEncounterSheetQuadroneContext());

  let initiative = $derived(rowContext.initiative?.toString() ?? '');
</script>

{#if context.unlocked}
  <span
    class="tidy-inline-quantity-tracker quantity-tracker-input-wrapper flexrow"
  >
    <input
      type="text"
      class="quantity-tracker-input"
      inputmode="numeric"
      {@attach InputAttachments.selectOnFocus}
      value={initiative}
      data-name="combatantSettings:initiative"
    />

    {#if rowContext.type === 'member'}
      <button
        type="button"
        class="button button-roll button-icon-only button-borderless flexshrink"
        data-action="prerollInitiative"
        data-has-roll-modes
      >
        <i class="fa-solid fa-dice-d20"></i>
      </button>
    {/if}
  </span>
{:else}
  <span class="font-label-large color-text-default"
    >{rowContext.initiative}</span
  >
{/if}
