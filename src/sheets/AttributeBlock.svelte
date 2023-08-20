<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e } from 'src/types/actor';
  import { formatAsModifier } from 'src/utils/formatting';
  import TextInput from 'src/components/form/TextInput.svelte';
  import BlockTitle from './BlockTitle.svelte';
  import BlockScore from './BlockScore.svelte';

  export let abbreviation: string;
  export let ability: any;
  export let actor: Actor5e;
  export let useSavingThrowProficiency: boolean;
  export let useConfigurationOption: boolean;

  const localize = FoundryAdapter.localize;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="wrapper">
  <BlockTitle
    title={ability.label}
    text={abbreviation}
    on:click={(event) => actor.rollAbility(ability, { event })}
  />
  <BlockScore>
    <TextInput
      document={actor}
      field="system.abilities.{abbreviation}.value"
      value={ability.value}
      placeholder="10"
      dtype="Number"
      selectOnFocus={true}
      allowDeltaChanges={true}
    />
  </BlockScore>
  <div class="ability-modifiers">
    <span
      class="ability-mod rollable"
      title={localize('DND5E.AbilityModifier')}
      on:click={(event) => actor.rollAbilityTest(abbreviation, { event })}
      >{formatAsModifier(ability.mod)}</span
    >
    <span
      class="ability-save rollable"
      title={localize('DND5E.ActionSave')}
      on:click={(event) => actor.rollAbilitySave(abbreviation, { event })}
      >{formatAsModifier(ability.save)}</span
    >
    {#if useSavingThrowProficiency}
      <a
        title={localize('DND5E.Proficiency')}
        class="proficiency-toggle"
        on:click={() =>
          actor.update({
            [`system.abilities.${abbreviation}.proficient`]:
              1 - parseInt(ability.proficient),
          })}
      >
        {@html ability.icon}
      </a>
    {/if}
    {#if useConfigurationOption}
      <a
        class="config-button"
        title={localize('DND5E.AbilityConfigure')}
        on:click={() =>
          new dnd5e.applications.actor.ActorAbilityConfig(
            actor,
            null,
            abbreviation
          ).render(true)}
      >
        <i class="fas fa-cog" />
      </a>
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

    &:hover .ability-mod,
    &:hover .ability-save {
      opacity: 1;
      text-shadow: none;
    }

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
      box-shadow: 0 0 0 1px var(--t5e-tertiary-color);
      border-radius: 0.3125rem;

      &:hover {
        border-radius: 0;
        box-shadow: 0 0 0 1px var(--t5e-note-background);
        z-index: 10;
      }

      &:hover ~ .mod-label {
        display: block;
        z-index: 5;
      }

      &:hover .ability-mod {
        border-radius: 0;
      }

      .ability-mod {
        background: var(--t5e-ability-accent);
        color: #fff; // TODO: Find appropriate color variable
        border-radius: 0.3125rem 0 0 0.3125rem;
      }
    }

    .mod-label {
      position: absolute;
      top: 2.9375rem; // This is far too precise; can we make this more relative to its target?
      display: none;
      background: var(--t5e-note-background);
      color: #fff; // TODO: Find appropriate color variable
      font-size: 0.625rem;
      height: 1.0625rem; // This is far too precise; can we make this more relative to its target?
      padding: 0.1875rem 0.25rem 0.125rem 0.25rem; // this padding is providing the positioning of the text. Can we do this in flexbox?
      white-space: nowrap;

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

    .ability-mod,
    .ability-save {
      flex: 1;
      text-align: center;
      font-size: 0.75rem;
      opacity: 0.4;
      transition: opacity 0.3s ease;
      cursor: pointer;
    }

    .ability-mod {
      background: var(--t5e-ability-accent);
      color: #fff; // TODO: Find appropriate color variable
      border-radius: 0.3125rem 0 0 0.3125rem;
    }

    .ability-mod:hover,
    .ability-save:hover {
      background: var(--t5e-primary-accent);
      color: #fff; // TODO: Find appropriate color variable
    }

    .proficiency-toggle {
      position: absolute;
      font-size: 0.625rem;
      opacity: 0.4;
      transition: opacity 0.3s ease;
      left: calc(50% - 0.75rem);
      bottom: -0.875rem;
    }

    .ability-modifiers .proficiency-toggle {
      line-height: 0.625rem;
    }

    &:hover .ability-mod,
    &:hover .ability-save {
      opacity: 1;
      text-shadow: none;
    }

    &:hover .proficiency-toggle {
      opacity: 1;
    }

    .config-button {
      position: absolute;
      bottom: -0.9375rem;
      right: calc(50% - 0.75rem);
      font-size: 0.625rem;
      color: var(--t5e-tertiary-color);

      &:hover {
        color: var(--t5e-primary-color);
      }
    }
  }
</style>
