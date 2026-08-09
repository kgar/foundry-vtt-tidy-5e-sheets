<script lang="ts">
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type {
    EncounterMemberCombatantQuadroneContext,
    EncounterMemberQuadroneContext,
  } from 'src/types/types';

  let {
    rowContext,
  }: {
    rowContext: EncounterMemberQuadroneContext;
  } = $props();

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

<input
  type="text"
  onchange={(ev) => handleChange(ev, rowContext)}
  {@attach InputAttachments.selectOnFocus}
  value={rowContext.quantity.formula}
  placeholder={context.unlocked ? '1d4+1' : '—'}
/>
