<script lang="ts">
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { EncounterMemberQuadroneContext } from 'src/types/types';

  let {
    rowContext,
  }: {
    rowContext: EncounterMemberQuadroneContext;
  } = $props();

  let context = $derived(getEncounterSheetQuadroneContext());
</script>

<input
  type="text"
  data-name="quantity.formula"
  {@attach InputAttachments.selectOnFocus}
  value={rowContext.quantity.formula}
  placeholder={context.unlocked ? '1d4+1' : '—'}
/>
