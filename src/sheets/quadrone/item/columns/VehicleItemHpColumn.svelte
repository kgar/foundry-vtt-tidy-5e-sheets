<script lang="ts">
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps } from 'src/runtime/types';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { VehicleItemContext } from 'src/types/types';

  let {
    rowDocument: item,
    rowContext,
  }: ColumnCellProps<any, VehicleItemContext> = $props();

  let context = $derived(getSheetContext());

  let hpValue = $derived(item.system.hp?.value ?? 0);
  let hpPct = $derived(item.system.hp?.pct ?? 0);
  let effectiveMaxHp = $derived(item.system.hp?.max ?? 0);

  function onHpChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const newValue = parseInt(target.value, 10);
    if (!isNaN(newValue)) {
      item.update({ 'system.hp.value': newValue });
    }
  }
</script>

<div
  class="meter meter-small progress hit-points"
  style="--bar-percentage: {hpPct.toFixed(0)}%"
></div>
<div class="inline-hp inline-uses flexrow">
  <input
    type="text"
    value={hpValue}
    {@attach InputAttachments.selectOnFocus}
    onchange={onHpChange}
    class="uninput uses-value hp-value color-text-default"
    disabled={!context.editable}
  />
  <span class="divider color-text-gold flexshrink">/</span>
  <span class="uses-max hp-max color-text-lighter">{effectiveMaxHp}</span>
</div>
