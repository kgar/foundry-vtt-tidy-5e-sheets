<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { formatAsModifier } from 'src/utils/formatting';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import BlockTitle from './RollableBlockTitle.svelte';
  import BlockScore from './BlockScore.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ActorSheetContext } from 'src/types/types';
  import { settingStore } from 'src/settings/settings';

  export let abbreviation: string;
  export let ability: any;
  export let useSavingThrowProficiency: boolean;
  export let useConfigurationOption: boolean;

  let context = getContext<Readable<ActorSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<div class="wrapper">
  <BlockTitle
    title={ability.label}
    text={abbreviation}
    on:roll={(event) =>
      $context.actor.rollAbility(abbreviation, { event: event.detail })}
    hideFromTabOrder={$settingStore.useOldAttributeTabbing}
  />
  <BlockScore>
    <TextInput
      document={$context.actor}
      field="system.abilities.{abbreviation}.value"
      value={ability.value}
      placeholder="10"
      selectOnFocus={true}
      allowDeltaChanges={true}
      disabled={$context.lockSensitiveFields}
    />
  </BlockScore>
  <div class="ability-modifiers">
    <button
      type="button"
      class="ability-mod transparent-button"
      class:rollable={$context.owner}
      title={localize('DND5E.AbilityModifier')}
      on:click={(event) =>
        $context.owner &&
        $context.actor.rollAbilityTest(abbreviation, { event })}
      tabindex={!$settingStore.useOldAttributeTabbing ? 0 : -1}
    >
      {formatAsModifier(ability.mod)}
    </button>
    <button
      type="button"
      class="ability-save transparent-button"
      class:rollable={$context.owner}
      title={localize('DND5E.ActionSave')}
      on:click={(event) =>
        $context.owner &&
        $context.actor.rollAbilitySave(abbreviation, { event })}
      tabindex={!$settingStore.useOldAttributeTabbing ? 0 : -1}
    >
      {formatAsModifier(ability.save)}
    </button>
    {#if useSavingThrowProficiency}
      {#if !$context.lockSensitiveFields}
        <button
          type="button"
          title={ability.hover}
          class="proficiency-toggle inline-icon-button"
          on:click={() =>
            $context.actor.update({
              [`system.abilities.${abbreviation}.proficient`]:
                1 - parseInt(ability.proficient),
            })}
          tabindex={!$settingStore.useOldAttributeTabbing ? 0 : -1}
        >
          {@html ability.icon}
        </button>
      {:else}
        <span title={ability.hover} class="proficiency-toggle-readonly"
          >{@html ability.icon}</span
        >
      {/if}
    {/if}
    {#if useConfigurationOption && $context.owner && !$context.lockSensitiveFields}
      <button
        type="button"
        class="config-button inline-icon-button"
        title={localize('DND5E.AbilityConfigure')}
        on:click={() =>
          FoundryAdapter.renderActorAbilityConfig($context.actor, abbreviation)}
        tabindex={!$settingStore.useOldAttributeTabbing ? 0 : -1}
      >
        <i class="fas fa-cog" />
      </button>
    {/if}
  </div>
  <span class="mod-label ability-mod-label">{localize('T5EK.AbbrMod')}</span>
  <span class="mod-label save-mod-label"
    >{localize('T5EK.AbbrSavingThrow')}</span
  >
</div>

<style lang="scss">
  .wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 3.125rem;
    margin: 0 auto;

    .ability-modifiers {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      text-align: center;
      height: auto;
      margin: 0 auto;
      padding: 0;
      opacity: initial;
      font-size: 0.625rem;
      box-shadow: 0 0 0 0.0625rem var(--t5ek-tertiary-color);
      border-radius: 0.3125rem;

      &:hover {
        border-radius: 0;
        box-shadow: 0 0 0 0.0625rem
          var(--t5ek-ability-modifiers-hover-label-background);
      }

      &:hover ~ .mod-label {
        display: block;
      }

      &:hover .ability-mod,
      &:hover .ability-save {
        border-radius: 0;
      }
    }

    .ability-mod {
      background: var(--t5ek-ability-accent-background);
      color: var(--t5ek-ability-mod-text-color);
      border-radius: 0.3125rem 0 0 0.3125rem;
    }

    .ability-save {
      border-radius: 0 0.3125rem 0.3125rem 0;
    }

    .ability-mod,
    .ability-save {
      flex: 1;
      text-align: center;
      font-size: 0.75rem;
      opacity: 0.4;
      transition: opacity 0.3s ease;
    }

    .ability-mod:hover,
    .ability-save:hover {
      background: var(--t5ek-primary-accent-color);
      color: var(--t5ek-ability-mod-save-text-hover-color);
    }

    &:hover .ability-mod,
    &:hover .ability-save {
      opacity: 1;
      text-shadow: none;
    }

    .mod-label {
      position: absolute;
      top: 2.9375rem; // This is far too precise; can we make this more relative to its target?
      display: none;
      background: var(--t5ek-ability-modifiers-hover-label-background);
      color: var(--t5ek-ability-modifiers-label-text-color);
      font-size: 0.625rem;
      height: 1.0625rem; // This is far too precise; can we make this more relative to its target?
      padding: 0.1875rem 0.25rem 0.125rem 0.25rem; // this padding is providing the positioning of the text. Can we do this in flexbox?
      white-space: nowrap;
      z-index: 1;

      &.ability-mod-label {
        right: 1.5625rem; // This is far too precise; can we make this more relative to its target?
        transform: translateX(
          -1.625rem
        ); // This is far too precise; can we make this more relative to its target?
        border-radius: 0.3125rem 0 0 0.3125rem;
      }

      &.save-mod-label {
        left: 1.5625rem; // This is far too precise; can we make this more relative to its target?
        transform: translateX(
          1.625rem
        ); // This is far too precise; can we make this more relative to its target?
        border-radius: 0 0.3125rem 0.3125rem 0;
      }
    }

    .proficiency-toggle,
    .proficiency-toggle-readonly {
      position: absolute;
      font-size: 0.625rem;
      opacity: 0.4;
      transition: opacity 0.3s ease;
      left: calc(50% - 0.75rem);
      bottom: -0.875rem;
      line-height: 0.625rem;
    }

    .proficiency-toggle-readonly {
      left: 0;
      right: 0;
    }

    &:hover .proficiency-toggle {
      opacity: 1;
    }

    .config-button {
      position: absolute;
      bottom: -0.9375rem;
      right: calc(50% - 0.75rem);
      font-size: 0.625rem;
      color: var(--t5ek-tertiary-color);

      &:hover {
        color: var(--t5ek-primary-color);
      }
    }
  }
</style>
