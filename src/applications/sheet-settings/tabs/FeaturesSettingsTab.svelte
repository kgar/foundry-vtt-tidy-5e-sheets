<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { SettingsProvider } from 'src/settings/settings';
  import CheckboxSetting from '../parts/CheckboxSetting.svelte';
  import type { SettingsSheetContext } from '../SheetSettings.types';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';

  let context = getContext<Writable<SettingsSheetContext>>('context');
  let appId = getContext<string>('appId');

  let exhaustionLevelsIterator: number[] = [];
  $: {
    if ($context.exhaustionConfig.type === 'specific') {
      let levelsWithZero = $context.exhaustionConfig.levels + 1;

      exhaustionLevelsIterator = Array(Math.max(levelsWithZero, 0)).fill(0);

      const missingHintSections =
        $context.exhaustionConfig.hints.length - levelsWithZero;

      if (missingHintSections > 0) {
        $context.exhaustionConfig.hints =
          $context.exhaustionConfig.hints.concat(
            Array(missingHintSections).fill(''),
          );
      }
    }
  }

  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('T5EK.Settings.ActionsList.Header')}</h2>

<CheckboxSetting
  bind:value={$context.settings.actionListLimitActionsToCantrips}
  name={SettingsProvider.settings.actionListLimitActionsToCantrips.options.name}
  hint={SettingsProvider.settings.actionListLimitActionsToCantrips.options.hint}
  id="actionListLimitActionsToCantrips"
/>

<CheckboxSetting
  bind:value={$context.settings.actionListIncludeMinuteLongSpellsAsActions}
  name={SettingsProvider.settings.actionListIncludeMinuteLongSpellsAsActions
    .options.name}
  hint={SettingsProvider.settings.actionListIncludeMinuteLongSpellsAsActions
    .options.hint}
  id="actionListIncludeMinuteLongSpellsAsActions"
/>

<CheckboxSetting
  bind:value={$context.settings.actionListIncludeSpellsWithActiveEffects}
  name={SettingsProvider.settings.actionListIncludeSpellsWithActiveEffects
    .options.name}
  hint={SettingsProvider.settings.actionListIncludeSpellsWithActiveEffects
    .options.hint}
  id="actionListIncludeSpellsWithActiveEffects"
/>

<CheckboxSetting
  bind:value={$context.settings.actionListIncludeConsumables}
  name={SettingsProvider.settings.actionListIncludeConsumables.options.name}
  hint={SettingsProvider.settings.actionListIncludeConsumables.options.hint}
  id="actionListIncludeConsumables"
/>

<CheckboxSetting
  bind:value={$context.settings.actionListScaleCantripDamage}
  name={SettingsProvider.settings.actionListScaleCantripDamage.options.name}
  hint={SettingsProvider.settings.actionListScaleCantripDamage.options.hint}
  id="actionListScaleCantripDamage"
/>

<h2>{localize('T5EK.Settings.Exhaustion.header')}</h2>

<!-- TODO: Add validation and add save logic -->
<article class="setting group">
  <section>
    <div class="description">
      <label for="exhaustionConfigType-{appId}"
        >{localize('T5EK.Settings.Exhaustion.name')}</label
      >
      <p class="tidy5e-notes">{localize('T5EK.Settings.Exhaustion.hint')}</p>
    </div>
    <div class="settings-group">
      <select
        id="exhaustionConfigType-{appId}"
        bind:value={$context.exhaustionConfig.type}
      >
        <SelectOptions
          data={{
            specific: 'T5EK.Settings.Exhaustion.options.specific.text',
            open: 'T5EK.Settings.Exhaustion.options.open.text',
          }}
        ></SelectOptions>
        {#if $context.exhaustionConfig.type === 'open'}
          <p class="tidy5e-notes">
            {localize('T5EK.Settings.Exhaustion.options.open.explanation')}
          </p>
        {/if}
      </select>
    </div>
  </section>
</article>

{#if $context.exhaustionConfig.type === 'specific'}
  <article class="setting group">
    <section>
      <div class="description">
        <label for="exhaustionConfigTypeLevels-{appId}"
          >{localize(
            'T5EK.Settings.Exhaustion.options.specific.levels.name',
          )}</label
        >
        <p class="tidy5e-notes">
          {localize('T5EK.Settings.Exhaustion.options.specific.levels.hint')}
        </p>
      </div>
      <div class="settings-group">
        <input type="number" bind:value={$context.exhaustionConfig.levels} />
      </div>
    </section>
  </article>

  {#if $context.exhaustionConfig.type === 'specific'}
    {#each exhaustionLevelsIterator as _, i (i)}
      <article class="setting group">
        <section class="">
          <div class="description">
            <label for="exhaustion-level-{i}-{appId}">
              {localize(
                'T5EK.Settings.Exhaustion.options.specific.levels.tooltip.name',
                {
                  level: i,
                },
              )}
              <!-- TODO: Put a tooltip icon here with a tooltip that is the localized version of the provided text value -->
            </label>
            <p class="tidy5e-notes">
              {localize(
                'T5EK.Settings.Exhaustion.options.specific.levels.tooltip.hint',
              )}
            </p>
          </div>
          <div class="settings-group">
            <input
              type="text"
              id="exhaustion-level-{i}-{appId}"
              bind:value={$context.exhaustionConfig.hints[i]}
            />
          </div>
        </section>
      </article>
    {/each}
  {/if}
{/if}
