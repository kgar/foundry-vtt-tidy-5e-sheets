<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActorAbilityContextEntry } from 'src/types/types';
  import { getModifierData } from 'src/utils/formatting';
  import { tick } from 'svelte';

  type Props = {
    ability: ActorAbilityContextEntry;
    unlocked: boolean;
    onScoreChanged?: (newValue: number) => Promise<void>;
    onConfigClicked?: (key: string) => void;
    onRollAbility?: (event: MouseEvent, key: string) => void;
    onRollSave?: (event: MouseEvent, key: string) => void;
  };
  let {
    ability,
    unlocked,
    onScoreChanged,
    onConfigClicked,
    onRollAbility,
    onRollSave,
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

<div class={['ability', ability.key]}>
  <div
    class={[
      'bonus-container',
      { proficient: ability.proficient === CONSTANTS.PROFICIENCY_PROFICIENT },
    ]}
  >
    <button
      type="button"
      onclick={(ev) => onRollAbility?.(ev, ability.key)}
      class="ability-roll-button label font-label-medium color-text-gold"
    >
      {ability.abbr}
    </button>
    <div class={['flexrow']}>
      <span
        class={[
          'modifier font-label-xlarge color-text-lightest',
          { invisible: editingScore },
        ]}>{mod.sign}</span
      >
      <span
        class={[
          'value bonus font-data-xlarge color-text-default',
          { invisible: editingScore },
        ]}>{mod.value}</span
      >

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
        />
      {/if}
    </div>
    {#if unlocked}
      <button
        aria-label={configButtonTooltip}
        type="button"
        class={[
          'button button-borderless button-icon-only button-config',
          { invisible: editingScore },
        ]}
        data-tooltip={configButtonTooltip}
        onclick={(ev) => onConfigClicked?.(ability.key)}
      >
        <i class="fas fa-cog"></i>
      </button>
    {/if}
    {#if unlocked && editingScore}
      <span class="editing-score-label">
        {localize('TIDY5E.Ability.EditScore.label')}
      </span>
    {/if}
  </div>
  <label
    class={['ability-score', { invisible: editingScore }]}
    for={abilityInputId}
  >
    <span class="font-title-small color-text-default">{ability.value}</span>
  </label>
  <button
    type="button"
    class="ability-save flexrow"
    onclick={(ev) => onRollSave?.(ev, ability.key)}
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
