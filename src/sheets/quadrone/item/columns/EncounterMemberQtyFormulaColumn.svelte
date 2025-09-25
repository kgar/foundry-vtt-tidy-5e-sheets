<script lang="ts">
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import type { ColumnCellProps } from 'src/runtime/types';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type {
    EncounterMemberQuadroneContext,
    EncounterPlaceholderQuadroneContext,
  } from 'src/types/types';

  let {
    rowDocument: _,
    rowContext,
  }: ColumnCellProps<
    any,
    EncounterMemberQuadroneContext | EncounterPlaceholderQuadroneContext
  > = $props();

  let context = $derived(getEncounterSheetQuadroneContext());

  async function handleChange(
    ev: Event & { currentTarget: EventTarget & HTMLInputElement },
    memberContext: EncounterMemberQuadroneContext,
  ) {
    const input = ev.currentTarget;
    const newValue = input.value ?? '';
    await context.sheet.updateMemberFormula(memberContext.actor.uuid, newValue);
  }
</script>

{#if rowContext.type === 'member'}
  <input
    type="text"
    onchange={(ev) => handleChange(ev, rowContext)}
    {@attach InputAttachments.selectOnFocus}
    value={rowContext.quantity.formula}
    placeholder={context.unlocked ? '1d4+1' : '—'}
  />
{/if}
