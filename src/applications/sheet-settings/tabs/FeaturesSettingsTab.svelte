<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import {
    SettingsProvider,
    type CurrentSettings,
  } from 'src/settings/settings';
  import CheckboxSetting from '../parts/CheckboxSetting.svelte';
  import { quadInOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  let context = getContext<Writable<CurrentSettings>>('context');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('T5EK.Settings.ActionsList.Header')}</h2>

{#if userIsGm}
  <CheckboxSetting
    bind:value={$context.useActionsList}
    name={SettingsProvider.settings.useActionsList.options.name}
    hint={SettingsProvider.settings.useActionsList.options.hint}
    id="useActionsList"
  />
{/if}

{#if $context.useActionsList}
  <div
    class:sub-settings={userIsGm}
    transition:slide={{ duration: 200, easing: quadInOut }}
  >
    <CheckboxSetting
      bind:value={$context.actionListLimitActionsToCantrips}
      name={SettingsProvider.settings.actionListLimitActionsToCantrips.options
        .name}
      hint={SettingsProvider.settings.actionListLimitActionsToCantrips.options
        .hint}
      id="actionListLimitActionsToCantrips"
    />

    <CheckboxSetting
      bind:value={$context.actionListIncludeMinuteLongSpellsAsActions}
      name={SettingsProvider.settings.actionListIncludeMinuteLongSpellsAsActions
        .options.name}
      hint={SettingsProvider.settings.actionListIncludeMinuteLongSpellsAsActions
        .options.hint}
      id="actionListIncludeMinuteLongSpellsAsActions"
    />

    <CheckboxSetting
      bind:value={$context.actionListIncludeSpellsWithActiveEffects}
      name={SettingsProvider.settings.actionListIncludeSpellsWithActiveEffects
        .options.name}
      hint={SettingsProvider.settings.actionListIncludeSpellsWithActiveEffects
        .options.hint}
      id="actionListIncludeSpellsWithActiveEffects"
    />

    <CheckboxSetting
      bind:value={$context.actionListIncludeConsumables}
      name={SettingsProvider.settings.actionListIncludeConsumables.options.name}
      hint={SettingsProvider.settings.actionListIncludeConsumables.options.hint}
      id="actionListIncludeConsumables"
    />

    <CheckboxSetting
      bind:value={$context.actionListRegisterCharacterTab}
      name={SettingsProvider.settings.actionListRegisterCharacterTab.options
        .name}
      hint={SettingsProvider.settings.actionListRegisterCharacterTab.options
        .hint}
      id="actionListRegisterCharacterTab"
    />

    {#if userIsGm}
      <CheckboxSetting
        bind:value={$context.actionListRegisterNpcTab}
        name={SettingsProvider.settings.actionListRegisterNpcTab.options.name}
        hint={SettingsProvider.settings.actionListRegisterNpcTab.options.hint}
        id="actionListRegisterNpcTab"
      />

      <CheckboxSetting
        bind:value={$context.actionListRegisterVehicleTab}
        name={SettingsProvider.settings.actionListRegisterVehicleTab.options
          .name}
        hint={SettingsProvider.settings.actionListRegisterVehicleTab.options
          .hint}
        id="actionListRegisterVehicleTab"
      />
    {/if}
  </div>
{/if}
