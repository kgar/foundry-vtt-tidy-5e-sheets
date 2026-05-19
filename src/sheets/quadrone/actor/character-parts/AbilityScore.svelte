<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActorAbilityContextEntry } from 'src/types/types';
  import { getModifierData } from 'src/utils/formatting';
  import { tick } from 'svelte';

  type Props = {
    ability: ActorAbilityContextEntry;
    unlocked: boolean;
    disabled: boolean;
    onScoreChanged?: (newValue: number) => Promise<void>;
  };
  let {
    ability,
    unlocked,
    disabled,
    onScoreChanged,
  }: Props = $props();

  const localize = FoundryAdapter.localize;

  const sourceValue = $derived(ability.source?.value ?? ability.value);

  const mod = $derived(getModifierData(ability.mod));
  const save = $derived(getModifierData(ability.save.value));

  const uniqueId = foundry.utils.randomID();

  const abilityInputId = $derived(`ability-score-${ability.key}-${uniqueId}`);

  let configButtonTooltip = $derived(
    localize('DND5E.AbilityConfigure', { ability: ability.label }),
  );

  async function onScoreChange(
    event: Event & { currentTarget: HTMLInputElement },
  ) {
    let value = +event.currentTarget.value;

    let isValid = !isNaN(value);

    if (isValid) {
      event.currentTarget.blur();
      await onScoreChanged?.(value);
      return;
    }

    event.currentTarget.value = sourceValue.toString();
  }

  let editingScore = $state(false);

  async function onScoreInputFocused(
    ev: Event & { currentTarget: HTMLInputElement },
  ) {
    await tick();
    ev.currentTarget.select();
    editingScore = true;
  }

  async function onScoreInputBlurred(
    ev: Event & { currentTarget: HTMLInputElement },
  ) {
    editingScore = false;
  }
</script>

<div class={['ability', ability.key, { 'has-proficiency': ability.proficient === CONSTANTS.PROFICIENCY_PROFICIENT }]} data-tidy-sheet-part="ability-container">
  <div
    class={[
      'ability-bonus-container',
      { proficient: ability.proficient === CONSTANTS.PROFICIENCY_PROFICIENT },
    ]}
    data-tidy-sheet-part="ability-mod-container"
  >
    <button
      type="button"
      data-action="roll"
      data-type="ability"
      data-ability={ability.key}
      data-tooltip={localize('DND5E.AbilityPromptTitle', {
        ability: ability.label,
      })}
      class="button-borderless ability-roll-button"
      data-tidy-sheet-part="ability-roller"
      data-has-roll-modes
      {disabled}
    >
      <span class="ability-abbr color-text-gold">{ability.abbr}</span>
      <span class="ability-label-container">
        <span class="modifier font-label-xlarge color-text-lightest" data-tidy-sheet-part="ability-mod">{mod.sign}</span><span class="value bonus font-data-xlarge color-text-default" data-tidy-sheet-part="ability-value">{mod.value}</span>
      </span>
    </button>
    {#if unlocked}
      <input
        id={abilityInputId}
        type="text"
        value={sourceValue}
        class={[
          'ability-score-input',
          'uninput',
          { ['editing-score']: editingScore },
        ]}
        data-tooltip={ability.label}
        onchange={onScoreChange}
        onfocus={(ev) => onScoreInputFocused(ev)}
        onblur={(ev) => onScoreInputBlurred(ev)}
        data-tidy-sheet-part="ability-score-input"
      />
    {/if}
    {#if unlocked && editingScore}
      <span class="editing-score-label font-label-medium color-text-default">
        {localize('TIDY5E.Ability.EditScore.label')}
      </span>
    {/if}
  </div>
  <div class="ability-score-container">
    <label
      class={['ability-score', { invisible: editingScore }]}
      data-tooltip={localize('DND5E.ABILITY.SECTIONS.Score', {
        ability: ability.label,
      })}
      for={abilityInputId}
      data-tidy-sheet-part="ability-score"
    >
      <span class="font-title-small color-text-default">{ability.value}</span>
      {#if ability.proficient === CONSTANTS.PROFICIENCY_PROFICIENT}
        <span class="ability-proficiency-indicator {unlocked ? 'config-button-visible' : ''}"></span>
      {/if}
    </label>
    {#if unlocked}
      <button
        aria-label={configButtonTooltip}
        type="button"
        class={[
          'button button-borderless button-icon-only button-config',
          { invisible: editingScore },
        ]}
        data-tooltip
        data-action="showConfiguration"
        data-config="ability"
        data-ability={ability.key}
        data-tidy-sheet-part="ability-configuration-control"
      >
        <i class="fas fa-cog"></i>
      </button>
    {/if}
  </div>
  <div class="ability-save-container">
    <button
      type="button"
      aria-label={localize('DND5E.SavingThrowRoll', { ability: ability.label })}
      data-tooltip
      class={[
        'button-borderless ability-save flexrow',
        'saving-throw',
        { invisible: editingScore },
      ]}
      data-action="roll"
      data-type="ability"
      data-ability={ability.key}
      data-tidy-sheet-part="ability-save-roller"
      data-has-roll-modes
      {disabled}
    >
      <span class="modifier font-label-medium color-text-lightest"
        >{save.sign}</span
      >
      <span class="value save font-data-medium color-text-default"
        >{save.value}</span
      >
      <span class="icon"><i class="fas fa-shield-heart"></i></span>
    </button>
  </div>
</div>
