<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { formatAsModifier } from 'src/utils/formatting';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import BlockTitle from './RollableBlockTitle.svelte';
  import BlockScore from './BlockScore.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { CONSTANTS } from 'src/constants';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';

  export let id: string;
  export let ability: any;
  export let useSavingThrowProficiency: boolean;
  export let useConfigurationOption: boolean;

  $: abbreviation = CONFIG.DND5E.abilities[id]?.abbreviation ?? id;

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;

  $: activeEffectApplied = ActiveEffectsHelper.isActiveEffectAppliedToField(
    $context.actor,
    `system.abilities.${id}.proficient`,
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
    on:roll={(event) => $context.actor.rollAbility(id, { event: event.detail })}
    attributes={{
      'data-tidy-sheet-part': CONSTANTS.SHEET_PARTS.ABILITY_ROLLER,
    }}
  />
  <BlockScore>
    <TextInput
      document={$context.actor}
      field="system.abilities.{id}.value"
      value={ability.value}
      placeholder="10"
      selectOnFocus={true}
      allowDeltaChanges={true}
      disabled={$context.lockSensitiveFields}
      attributes={{
        'data-tidy-sheet-part': CONSTANTS.SHEET_PARTS.ABILITY_SCORE,
      }}
    />
  </BlockScore>
  <div class="ability-modifiers">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      class="ability-mod transparent-button"
      class:rollable={$context.editable}
      title={localize('DND5E.AbilityModifier')}
      on:click={(event) =>
        $context.editable && $context.actor.rollAbilityTest(id, { event })}
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ABILITY_TEST_ROLLER}
    >
      {formatAsModifier(ability.mod)}
    </a>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      class="ability-save transparent-button"
      class:rollable={$context.editable}
      title={localize('DND5E.ActionSave')}
      on:click={(event) =>
        $context.editable && $context.actor.rollAbilitySave(id, { event })}
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ABILITY_SAVE_ROLLER}
    >
      {formatAsModifier(ability.save)}
    </a>
    {#if useSavingThrowProficiency}
      {#if $context.unlocked}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
          title={ability.hover}
          class="proficiency-toggle inline-icon-button"
          on:click={() =>
            !activeEffectApplied &&
            $context.actor.update({
              [`system.abilities.${id}.proficient`]:
                1 - parseInt(ability.proficient),
            })}
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
            .ABILITY_SAVE_PROFICIENCY_TOGGLE}
          data-tooltip={activeEffectApplied
            ? localize('DND5E.ActiveEffectOverrideWarning')
            : null}
        >
          {@html ability.icon}
        </a>
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
    {#if useConfigurationOption && $context.editable && $context.unlocked}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        class="config-button inline-icon-button"
        title={localize('DND5E.AbilityConfigure')}
        on:click={() =>
          FoundryAdapter.renderActorAbilityConfig($context.actor, id)}
        data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
          .ABILITY_CONFIGURATION_CONTROL}
      >
        <i class="fas fa-cog" />
      </a>
    {/if}
  </div>
  <span class="mod-label ability-mod-label">{localize('TIDY5E.AbbrMod')}</span>
  <span class="mod-label save-mod-label"
    >{localize('TIDY5E.AbbrSavingThrow')}</span
  >
</div>
