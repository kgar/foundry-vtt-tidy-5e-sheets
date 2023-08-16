<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { NpcSheetContext } from 'src/types/types';
  import { debug } from 'src/utils/logging';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import TextInput from 'src/components/form/TextInput.svelte';

  let store = getContext<Readable<NpcSheetContext>>('store');

  async function rollNpcHp(event: Event) {
    event.preventDefault();

    const formula = $store.actor.system.attributes.hp.formula;
    if (!formula) return;
    const roll_hp = await new Roll(formula).evaluate({ async: true });
    const hp = roll_hp.total;
    AudioHelper.play({ src: CONFIG.sounds.dice });
    $store.actor.update({
      'system.attributes.hp.value': hp,
      'system.attributes.hp.max': hp,
    });
  }

  function calcAverageHitDie(event: Event) {
    event.preventDefault();

    let formula = $store.actor.system.attributes.hp.formula;
    debug(`tidy5e-npc | activateListeners | formula: ${formula}`);
    let r = new Roll(formula);
    let term = r.terms;
    debug(`tidy5e-npc | activateListeners | term: ${term}`);
    let averageString: string | any[] = '';
    for (let i = 0; i < term.length; i++) {
      let type = term[i].constructor.name;
      switch (type) {
        case 'Die': {
          averageString += Math.floor(
            (term[i].faces * term[i].number + term[i].number) / 2
          );
          break;
        }
        case 'OperatorTerm': {
          averageString += term[i].operator;
          break;
        }
        case 'NumericTerm': {
          averageString += term[i].number;
          break;
        }
        default: {
          break;
        }
      }
    }
    debug(`tidy5e-npc | activateListeners | averageString: ${averageString}`);
    let average = 0;
    averageString =
      averageString.replace(/\s/g, '').match(/[+\-]?([0-9\.\s]+)/g) ?? [];
    while (averageString.length) {
      average += parseFloat(averageString.shift());
    }
    debug(`tidy5e-npc | activateListeners | average: ${average}`);

    $store.actor.update({
      ['system.attributes.hp.value']: average,
      ['system.attributes.hp.max']: average,
    });
  }

  const localize = FoundryAdapter.localize;
</script>

<div class="portrait-hp-formula health" title={localize('DND5E.HPFormula')}>
  <span
    class="rollable"
    title="{localize('DND5E.HitDiceRoll')}/{localize(
      'TIDY5E.HitDiceRollAverage'
    )}"
    on:click={rollNpcHp}
    on:contextmenu={calcAverageHitDie}
  >
    <i class="fas fa-dice-six" />
  </span>
  <div class="formula-edit">
    <TextInput
      document={$store.actor}
      field="system.attributes.hp.formula"
      cssClass="hpformula"
      placeholder={localize('DND5E.HPFormula')}
      value={$store.system.attributes.hp.formula}
      maxlength={12}
      title="{localize('DND5E.HPFormula')}: {$store.system.attributes.hp
        .formula}"
    />
  </div>
</div>

<style lang="scss">
  .health {
    position: absolute;
    z-index: 25;
    right: 0.4375rem;
    bottom: 0rem;

    span {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 1.25rem;
      width: 1.375rem;
      border-radius: 0 5px 5px 0;
    }

    .formula-edit {
      background: var(--t5e-icon-background);
      box-shadow: 0 0 10px var(--t5e-icon-shadow) inset;
      border: 1px solid var(--t5e-icon-outline);
      display: none;
      justify-content: center;
      align-items: center;
      position: absolute;
      bottom: 100%;
      right: 0;
      width: 136px;
      height: 20px;
      border-radius: 5px;
    }

    &:hover .formula-edit,
    .formula-edit:focus-within {
      display: flex;
    }

    :global(input) {
      text-align: center;
      width: 100%;
      height: 100%;
      font-size: 0.75rem;
      border-radius: 0.3125rem;
      margin: 0;
    }
  }
</style>
