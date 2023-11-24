<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/sheet-settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { SettingsProvider } from 'src/settings/settings';
  import NumberInputSetting from 'src/applications/sheet-settings/parts/NumberInputSetting.svelte';
  import SelectSetting from '../parts/SelectSetting.svelte';
  import type {
    SettingsSheetContext,
    SettingsSheetFunctions,
  } from '../SheetSettings.types';
  import SelectionListbox from 'src/components/listbox/SelectionListbox.svelte';
  import { getAllRegisteredVehicleSheetTabs } from 'src/runtime/vehicle-sheet-state';

  let context = getContext<Writable<SettingsSheetContext>>('context');
  let functions = getContext<SettingsSheetFunctions>('functions');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;

  function resetDefaultTabs(): any {
    $context.defaultCharacterTabs = functions.mapTabSelectionFields(
      getAllRegisteredVehicleSheetTabs(),
      [...SettingsProvider.settings.defaultVehicleSheetTabs.options.default],
    );
  }
</script>

<h2>{localize('T5EK.Settings.TabVehicles.header')}</h2>
{#if userIsGm}
  <SelectSetting
    options={SettingsProvider.settings.initialVehicleSheetTab.options.choices()}
    bind:value={$context.settings.initialVehicleSheetTab}
    name={SettingsProvider.settings.initialVehicleSheetTab.options.name}
    hint={SettingsProvider.settings.initialVehicleSheetTab.options.hint}
    id="initialVehicleSheetTab"
  />

  <article class="setting group">
    <div class="description flex-1">
      <b
        >{localize(
          SettingsProvider.settings.defaultVehicleSheetTabs.options.name,
        )}</b
      >
      <p>
        {localize(
          SettingsProvider.settings.defaultVehicleSheetTabs.options.hint,
        )}
      </p>
      <div class="flex-column small-gap">
        <SelectionListbox
          bind:leftItems={$context.defaultVehicleTabs.available}
          bind:rightItems={$context.defaultVehicleTabs.selected}
          labelProp="label"
          valueProp="id"
        >
          <b slot="left-header" class="minimal"
            >{localize('T5EK.Settings.DefaultSheetTabs.AvailableHeader')}</b
          >
          <b slot="right-header" class="minimal"
            >{localize('T5EK.Settings.DefaultSheetTabs.SelectedHeader')}</b
          >
        </SelectionListbox>
        <button type="button" on:click={() => resetDefaultTabs()}>
          <i class="fas fa-rotate-right" />
          {localize('T5EK.UseDefault')}
        </button>
      </div>
    </div>
  </article>
{/if}

<CheckboxSetting
  bind:value={$context.settings.useClassicControlsForVehicle}
  name={SettingsProvider.settings.useClassicControlsForVehicle.options.name}
  hint={SettingsProvider.settings.useClassicControlsForVehicle.options.hint}
  id="useClassicControlsForVehicle"
/>

<CheckboxSetting
  bind:value={$context.settings.useHpBarVehicle}
  name={'T5EK.Settings.UseHpBar.name'}
  hint={'T5EK.Settings.UseHpBar.hint'}
  id="useHpBarVehicle"
/>

<CheckboxSetting
  bind:value={$context.settings.useHpOverlayVehicle}
  name={'T5EK.Settings.UseHpOverlay.name'}
  hint={'T5EK.Settings.UseHpOverlay.hint'}
  id="useHpOverlayVehicle"
/>

<NumberInputSetting
  bind:value={$context.settings.vehicleSheetWidth}
  name={'T5EK.Settings.VehicleSheetWidth.name'}
  hint={'T5EK.Settings.VehicleSheetWidth.hint'}
  id="vehicleSheetWidth"
/>
