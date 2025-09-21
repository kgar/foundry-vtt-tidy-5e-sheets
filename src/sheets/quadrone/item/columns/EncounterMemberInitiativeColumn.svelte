<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type {
    EncounterMemberQuadroneContext,
    EncounterPlaceholderQuadroneContext,
  } from 'src/types/types';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<
    any,
    EncounterMemberQuadroneContext | EncounterPlaceholderQuadroneContext
  > = $props();

  let context = $derived(getEncounterSheetQuadroneContext());

  let localize = FoundryAdapter.localize;

  let initiative = $derived(rowContext.initiative?.toString() ?? '');

  function onInitiativeChange(newValue: string): Promise<void> | undefined {
    return context.sheet.updateInitiative(
      rowContext.type === 'member' ? rowContext.actor.uuid : rowContext.id,
      newValue,
    );
  }
</script>

{#if context.unlocked}
  <span
    class="tidy-inline-quantity-tracker quantity-tracker-input-wrapper flexrow"
  >
    <input
      type="text"
      class="quantity-tracker-input"
      {@attach InputAttachments.selectOnFocus}
      value={initiative}
      onchange={async (ev) => {
        const input = ev.currentTarget;
        await onInitiativeChange(input.value);
        input.value = initiative;
      }}
    />

    {#if rowContext.type === 'member'}
      <button
        class="button button-roll button-icon-only button-borderless flexshrink"
        onclick={(ev) => context.sheet.prerollInitiative(ev, rowDocument)}
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
