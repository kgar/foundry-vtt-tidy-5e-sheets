<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import CharacterPortrait from 'src/sheets/character/parts/ActorPortrait.svelte';
  import DeathSaves from 'src/sheets/DeathSaves.svelte';
  import Exhaustion from 'src/sheets/Exhaustion.svelte';
  import HpOverlay from 'src/sheets/HpOverlay.svelte';
  import type { NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NpcHitPoints from './NpcHitPoints.svelte';
  import TempHp from 'src/sheets/TempHp.svelte';
  import TextInput from 'src/components/form/TextInput.svelte';
  import { debug } from 'src/utils/logging';

  let store = getContext<Readable<NpcSheetContext>>('store');

  const portraitStyle = SettingsProvider.settings.portraitStyle.get();
  const useRoundedPortraitStyle = ['all', 'npc'].includes(portraitStyle);

  $: incapacitated =
    ($store.actor?.system?.attributes?.hp?.value ?? 0) <= 0 &&
    $store.actor?.system?.attributes?.hp?.max !== 0;

  function onLevelSelected(event: CustomEvent<{ level: number }>) {
    FoundryAdapter.setFlag($store.actor, 'exhaustion', event.detail.level);
  }

  function showDeathSaves(): boolean {
    const isEnabledForAll =
      !SettingsProvider.settings.hiddenDeathSavesEnabled.get();
    return incapacitated && (isEnabledForAll || FoundryAdapter.userIsGm());
  }

  async function rollNpcHp(event: Event) {
    event.preventDefault();

    const formula = $store.actor.system.attributes.hp.formula;
    if (!formula) return;
    // const hp = new Roll(formula).roll().total;
    const roll_hp = await new Roll(formula).roll();
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

<div class="profile-wrap">
  <div class="profile" class:round-portrait={useRoundedPortraitStyle}>
    <CharacterPortrait actor={$store.actor} />
    {#if !SettingsProvider.settings.hpOverlayDisabled.get()}
      <HpOverlay {useRoundedPortraitStyle} actor={$store.actor} />
    {/if}
    {#if showDeathSaves()}
      <DeathSaves
        successes={$store.system.attributes.death.success}
        failures={$store.system.attributes.death.failure}
        {useRoundedPortraitStyle}
        on:rollDeathSave={(event) =>
          $store.actor.rollDeathSave({ event: event.detail.mouseEvent })}
      />
    {/if}
    {#if !SettingsProvider.settings.exhaustionDisabled.get() && !incapacitated}
      <Exhaustion
        level={FoundryAdapter.tryGetFlag($store.actor, 'exhaustion') ?? 0}
        radiusClass={useRoundedPortraitStyle ? 'rounded' : 'top-left'}
        on:levelSelected={onLevelSelected}
        onlyShowOnHover={SettingsProvider.settings.exhaustionOnHover.get() ||
          (SettingsProvider.settings.hideIfZero.get() &&
            $store.system.attributes.exhaustion === 0)}
      />
    {/if}
    <!-- Optional REST? -->
    <div
      class="rest-container has-note"
      data-tooltip={localize('T5EK.RestHint')}
    >
      <div class="resting">
        <span class="resting-icon">
          <i class="rest-icon fas fa-bed" />
        </span>
        <a
          class="rest short-rest"
          title={localize('T5EK.RestS')}
          on:click={(ev) => $store.shortRest(ev)}
        >
          <i class="fas fa-hourglass-half" />
        </a>
        <a
          class="rest long-rest"
          title={localize('T5EK.RestL')}
          on:click={(ev) => $store.longRest(ev)}
        >
          <i class="fas fa-hourglass-end" />
        </a>
      </div>
    </div>
    <!-- Hit Dice -->
    <NpcHitPoints {useRoundedPortraitStyle} />

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
          tooltip="{localize('DND5E.HPFormula')}: {$store.system.attributes.hp
            .formula}"
        />
      </div>
    </div>
  </div>
</div>
<TempHp />
