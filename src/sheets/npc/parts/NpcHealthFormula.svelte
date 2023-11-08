<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { NpcSheetContext } from 'src/types/types';
  import { debug } from 'src/utils/logging';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import TextInput from 'src/components/inputs/TextInput.svelte';

  let context = getContext<Readable<NpcSheetContext>>('context');

  async function rollNpcHp(event: Event) {
    event.preventDefault();

    const formula = $context.actor.system.attributes.hp.formula;
    if (!formula) return;
    const roll_hp = await FoundryAdapter.roll(formula, undefined, {
      async: true,
    });
    const hp = roll_hp.total;
    FoundryAdapter.playDiceSound();
    $context.actor.update({
      'system.attributes.hp.value': hp,
      'system.attributes.hp.max': hp,
    });
  }

  function calcAverageHitDie(event: Event) {
    event.preventDefault();

    let formula = $context.actor.system.attributes.hp.formula;
    debug(`tidy5e-npc | activateListeners | formula: ${formula}`);
    const average = FoundryAdapter.calculateAverageFromFormula(formula);

    $context.actor.update({
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
      'T5EK.HitDiceRollAverage'
    )}"
    on:click={rollNpcHp}
    on:contextmenu={calcAverageHitDie}
    class="roll-hp-formula"
  >
    <i class="fas fa-dice-six" />
  </button>
  <div class="formula-edit">
    <TextInput
      document={$context.actor}
      field="system.attributes.hp.formula"
      cssClass="hp-formula"
      placeholder={localize('DND5E.HPFormula')}
      value={$context.system.attributes.hp.formula}
      maxlength={12}
      title="{localize('DND5E.HPFormula')}: {$context.system.attributes.hp
        .formula}"
      disabled={!$context.owner}
    />
  </div>
</div>

<style lang="scss">
  .health {
    position: absolute;
    z-index: 25;
    right: 0.4375rem;
    bottom: 0rem;

    .formula-edit {
      background: var(--t5ek-icon-background);
      box-shadow: 0 0 0.625rem var(--t5ek-icon-shadow-color) inset;
      border: 0.0625rem solid var(--t5ek-icon-outline-color);
      display: none;
      justify-content: center;
      align-items: center;
      position: absolute;
      bottom: 100%;
      right: 0;
      width: 8.5rem;
      height: 1.25rem;
      border-radius: 0.3125rem;
    }

    &:hover .formula-edit,
    .formula-edit:focus-within {
      display: flex;
    }

    :global(.hp-formula) {
      text-align: center;
      width: 100%;
      height: 100%;
      font-size: 0.75rem;
      border-radius: 0.3125rem;
      margin: 0;
    }

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

      &:hover {
        color: var(--t5ek-primary-accent-color);
      }
    }
  }
</style>
