<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { formatAsModifier } from 'src/utils/formatting';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import BlockTitle from './RollableBlockTitle.svelte';
  import BlockScore from './BlockScore.svelte';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { settings } from 'src/settings/settings.svelte';
  import { CONSTANTS } from 'src/constants';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    id: string;
    ability: any;
    useSavingThrowProficiency: boolean;
    useConfigurationOption: boolean;
  }

  let {
    id,
    ability,
    useSavingThrowProficiency,
    useConfigurationOption,
  }: Props = $props();

  let abbreviation = $derived(
    CONFIG.DND5E.abilities[id as keyof typeof CONFIG.DND5E.abilities]
      ?.abbreviation ?? id,
  );

  let context = $derived(getSheetContext<ActorSheetContextV1>());

  const localize = FoundryAdapter.localize;

  let activeEffectApplied = $derived(
    ActiveEffectsHelper.isActiveEffectAppliedToField(
      context.actor,
      `system.abilities.${id}.proficient`,
    ),
  );
</script>

<div
  class="ability-score-container"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ABILITY_SCORE_CONTAINER}
  data-ability={id}
>
  <BlockTitle
    title={ability.label}
    text={abbreviation}
    onRoll={(event) => context.actor.rollAbility({ ability: id, event: event })}
    hideFromTabOrder={settings.value.useDefaultSheetAttributeTabbing ||
      !settings.value.useAccessibleKeyboardSupport}
    attributes={{
      'data-tidy-sheet-part': CONSTANTS.SHEET_PARTS.ABILITY_ROLLER,
    }}
  />
  <BlockScore>
    <TextInput
      document={context.actor}
      field="system.abilities.{id}.value"
      value={ability.value}
      placeholder="10"
      selectOnFocus={true}
      allowDeltaChanges={true}
      disabled={context.lockSensitiveFields}
      attributes={{
        'data-tidy-sheet-part': CONSTANTS.SHEET_PARTS.ABILITY_SCORE,
      }}
    />
  </BlockScore>
  <div class="ability-modifiers">
    <button
      type="button"
      class="ability-mod transparent-button"
      class:rollable={context.editable}
      title={localize('DND5E.AbilityModifier')}
      onclick={(event) =>
        context.actor.rollAbilityCheck({ ability: id, event })}
      tabindex={!settings.value.useDefaultSheetAttributeTabbing &&
      settings.value.useAccessibleKeyboardSupport
        ? 0
        : -1}
      disabled={!context.editable}
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ABILITY_TEST_ROLLER}
    >
      {formatAsModifier(ability.mod)}
    </button>
    <button
      type="button"
      class="ability-save transparent-button"
      class:rollable={context.editable}
      title={localize('DND5E.ActionSave')}
      onclick={(event) => context.actor.rollSavingThrow({ ability: id, event })}
      tabindex={!settings.value.useDefaultSheetAttributeTabbing &&
      settings.value.useAccessibleKeyboardSupport
        ? 0
        : -1}
      disabled={!context.editable}
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ABILITY_SAVE_ROLLER}
    >
      {formatAsModifier(ability.save.value)}
    </button>
    {#if useSavingThrowProficiency}
      {#if context.unlocked}
        <button
          type="button"
          title={ability.hover}
          class="proficiency-toggle inline-icon-button"
          onclick={() =>
            context.actor.update({
              [`system.abilities.${id}.proficient`]:
                1 - parseInt(ability.proficient),
            })}
          tabindex={!settings.value.useDefaultSheetAttributeTabbing &&
          settings.value.useAccessibleKeyboardSupport
            ? 0
            : -1}
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
            .ABILITY_SAVE_PROFICIENCY_TOGGLE}
          disabled={activeEffectApplied}
          data-tooltip={activeEffectApplied
            ? localize('DND5E.ActiveEffectOverrideWarning')
            : null}
        >
          {@html ability.icon}
        </button>
      {:else}
        <span
          title={ability.hover}
          class="proficiency-toggle-readonly"
          data-tooltip={activeEffectApplied
            ? localize('DND5E.ActiveEffectOverrideWarning')
            : null}>{@html ability.icon}</span
        >
      {/if}
    {/if}
    {#if useConfigurationOption && context.editable && context.unlocked}
      <button
        type="button"
        class="config-button inline-icon-button"
        title={localize('DND5E.AbilityConfigure', { ability: ability.label })}
        onclick={() => FoundryAdapter.renderAbilityConfig(context.actor, id)}
        tabindex={!settings.value.useDefaultSheetAttributeTabbing &&
        settings.value.useAccessibleKeyboardSupport
          ? 0
          : -1}
        data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
          .ABILITY_CONFIGURATION_CONTROL}
      >
        <i class="fas fa-cog"></i>
      </button>
    {/if}
  </div>
  <span class="mod-label ability-mod-label">{localize('TIDY5E.AbbrMod')}</span>
  <span class="mod-label save-mod-label"
    >{localize('TIDY5E.AbbrSavingThrow')}</span
  >
</div>
