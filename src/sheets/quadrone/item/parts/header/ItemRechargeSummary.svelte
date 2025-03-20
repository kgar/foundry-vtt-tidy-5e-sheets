<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  let faces: Record<string, string> = {
    '1': 'fa-solid fa-dice-one',
    '2': 'fa-solid fa-dice-two',
    '3': 'fa-solid fa-dice-three',
    '4': 'fa-solid fa-dice-four',
    '5': 'fa-solid fa-dice-five',
    '6': 'fa-solid fa-dice-six',
  };

  let unknownFace = 'fa-solid fa-dice';

  let formula = $derived(context.system.uses.recovery[0]?.formula ?? '');
  let recharge = $derived(formula === '6' ? formula : `${formula}-6`);
  let diceIconClass = $derived(faces[formula] ?? unknownFace);
</script>

<div class="item-recharge">
  <span class="color-text-lighter text-data">
    {localize('TIDY5E.RollRecharge.Label')}
  </span>
  <i class="{diceIconClass} color-text-lighter text-label-icon"></i>
  <span class="recharge-range-text text-data">
    {recharge}
  </span>
</div>
