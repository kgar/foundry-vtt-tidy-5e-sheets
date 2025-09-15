<script lang="ts">
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import type { ColumnCellProps } from 'src/runtime/types';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { EncounterMemberQuadroneContext } from 'src/types/types';

  let {
    rowDocument: _,
    rowContext,
  }: ColumnCellProps<any, EncounterMemberQuadroneContext> = $props();

  let context = $derived(getEncounterSheetQuadroneContext());

  async function handleChange(
    ev: Event & { currentTarget: EventTarget & HTMLInputElement },
  ) {
    const input = ev.currentTarget;
    const newValue = input.value ?? '';
    await context.sheet.updateMemberFormula(rowContext.actor.uuid, newValue);
  }
</script>

<input
  type="text"
  onchange={(ev) => handleChange(ev)}
  {@attach InputAttachments.selectOnFocus}
  value={rowContext.quantity.formula}
  placeholder="{context.unlocked ? '1d4+1' : '—'}"
/>
