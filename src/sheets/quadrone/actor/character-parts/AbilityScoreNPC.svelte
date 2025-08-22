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
    onConfigClicked?: (key: string) => void;
    onRollAbility?: (event: MouseEvent, key: string) => void;
    onRollSave?: (event: MouseEvent, key: string) => void;
  };
  let {
    ability,
    unlocked,
    disabled,
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

{#if !unlocked}
  <div class={['ability', ability.key]}>
    <div class="ability-bonus-container">
      <div
        class={[
          'bonus-container',
          {
            proficient: ability.proficient === CONSTANTS.PROFICIENCY_PROFICIENT,
          },
        ]}
        data-tidy-sheet-part="ability-mod-container"
      >
        <button
          type="button"
          onclick={(ev) => onRollAbility?.(ev, ability.key)}
          data-tooltip={localize('DND5E.AbilityPromptTitle', {
            ability: ability.label,
          })}
          class="button-borderless ability-roll-button label font-label-medium color-text-gold"
          data-tidy-sheet-part="ability-roller"
          {disabled}
        >
          {ability.abbr}
        </button>
        <div class={['flexrow']}>
          <span
            class={[
              'modifier font-label-xlarge color-text-lightest',
              { invisible: editingScore },
            ]}
            data-tidy-sheet-part="ability-mod">{mod.sign}</span
          >
          <span
            class={[
              'value bonus font-data-xlarge color-text-default',
              { invisible: editingScore },
            ]}
            data-tidy-sheet-part="ability-value">{mod.value}</span
          >
        </div>
      </div>
    </div>
    <div class="ability-score-container">
      <label
        class={['ability-score']}
        data-tooltip={localize('DND5E.ABILITY.SECTIONS.Score', {
          ability: ability.label,
        })}
        for={abilityInputId}
        data-tidy-sheet-part="ability-score"
      >
        <span class="font-title-small color-text-default">{ability.value}</span>
      </label>
    </div>
    <div class="ability-save-container">
      <button
        type="button"
        aria-label={localize('DND5E.SavingThrowRoll', {
          ability: ability.label,
        })}
        data-tooltip={localize('DND5E.SavingThrowRoll', {
          ability: ability.label,
        })}
        class={[
          'button-borderless ability-save flexrow',
          { invisible: editingScore },
        ]}
        onclick={(ev) => onRollSave?.(ev, ability.key)}
        data-tidy-sheet-part="ability-save-roller"
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
{:else}
  <div class={['ability', ability.key]}>
    <div class="ability-bonus-container">
      <div
        class={[
          'bonus-container',
          {
            proficient: ability.proficient === CONSTANTS.PROFICIENCY_PROFICIENT,
          },
        ]}
        data-tidy-sheet-part="ability-mod-container"
      >
        <button
          type="button"
          onclick={(ev) => onRollAbility?.(ev, ability.key)}
          data-tooltip={localize('DND5E.AbilityPromptTitle', {
            ability: ability.label,
          })}
          class="button-borderless ability-roll-button label font-label-medium color-text-gold"
          data-tidy-sheet-part="ability-roller"
          {disabled}
        >
          {ability.abbr}
        </button>
        <div class={['flexrow']}>
          <span
            class={[
              'modifier font-label-xlarge color-text-lightest',
              { invisible: editingScore },
            ]}
            data-tidy-sheet-part="ability-mod">{mod.sign}</span
          >
          <span
            class={[
              'value bonus font-data-xlarge color-text-default',
              { invisible: editingScore },
            ]}
            data-tidy-sheet-part="ability-value">{mod.value}</span
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
              data-tidy-sheet-part="ability-score-input"
            />
          {/if}
        </div>
        {#if unlocked && editingScore}
          <span
            class="editing-score-label font-label-medium color-text-default"
          >
            {localize('TIDY5E.Ability.EditScore.label')}
          </span>
        {/if}
      </div>
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
      </label>
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
          data-tidy-sheet-part="ability-configuration-control"
        >
          <i class="fas fa-cog"></i>
        </button>
      {/if}
    </div>
    <div class="ability-save-container">
      <button
        type="button"
        aria-label={localize('DND5E.SavingThrowRoll', {
          ability: ability.label,
        })}
        data-tooltip={localize('DND5E.SavingThrowRoll', {
          ability: ability.label,
        })}
        class={[
          'button-borderless ability-save flexrow',
          { invisible: editingScore },
        ]}
        onclick={(ev) => onRollSave?.(ev, ability.key)}
        data-tidy-sheet-part="ability-save-roller"
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
{/if}
