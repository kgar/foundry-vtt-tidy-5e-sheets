<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { debug } from 'src/utils/logging';
  import { settings } from 'src/settings/settings.svelte';
  import { getNpcSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getNpcSheetContext());

  async function rollNpcHp(event: Event) {
    event.preventDefault();

    const formula = context.actor.system.attributes.hp.formula;
    if (!formula) return;
    const roll_hp = await FoundryAdapter.roll(formula, undefined);
    const hp = roll_hp.total;
    FoundryAdapter.playDiceSound();
    context.actor.update({
      'system.attributes.hp.value': hp,
      'system.attributes.hp.max': hp,
    });
  }

  function calcAverageHitDie(event: Event) {
    event.preventDefault();

    let formula = context.actor.system.attributes.hp.formula;
    debug(`tidy5e-npc | activateListeners | formula: ${formula}`);
    const average = FoundryAdapter.calculateAverageFromFormula(formula);

    context.actor.update({
      ['system.attributes.hp.value']: average,
      ['system.attributes.hp.max']: average,
    });
  }

  const localize = FoundryAdapter.localize;
</script>

<div class="portrait-hp-formula health" title={localize('DND5E.HPFormula')}>
  <button
    type="button"
    title="{localize('DND5E.HitDiceRoll')}/{localize(
      'TIDY5E.HitDiceRollAverage',
    )}"
    onclick={rollNpcHp}
    oncontextmenu={calcAverageHitDie}
    class="roll-hp-formula highlight-on-hover"
    tabindex={!settings.value.useDefaultSheetHpTabbing &&
    settings.value.useAccessibleKeyboardSupport
      ? 0
      : -1}
  >
    <i class="fas fa-dice-six"></i>
  </button>
</div>

<style lang="less">
  .health {
    position: absolute;
    right: 0.4375rem;
    bottom: 0rem;

    .roll-hp-formula {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 1.25rem;
      width: 1.375rem;
      border-radius: 0 0.3125rem 0.3125rem 0;
      border: none;
      padding: 0;
      background: none;
      transition: color 0.3s ease;
    }
  }
</style>
