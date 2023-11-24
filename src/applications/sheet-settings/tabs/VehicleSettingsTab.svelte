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
  import { getAllRegisteredVehicleSheetTabs } from 'src/runtime/vehicle-sheet-state';
  import ListboxSetting from '../parts/ListboxSetting.svelte';

  let context = getContext<Writable<SettingsSheetContext>>('context');
  let functions = getContext<SettingsSheetFunctions>('functions');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;

  function resetDefaultTabs(): any {
    $context.defaultVehicleTabs = functions.mapTabSelectionFields(
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

  <ListboxSetting
    name={SettingsProvider.settings.defaultVehicleSheetTabs.options.name}
    hint={SettingsProvider.settings.defaultVehicleSheetTabs.options.hint}
    leftHeader="T5EK.Settings.DefaultSheetTabs.AvailableHeader"
    bind:leftItems={$context.defaultVehicleTabs.available}
    rightHeader="T5EK.Settings.DefaultSheetTabs.SelectedHeader"
    bind:rightItems={$context.defaultVehicleTabs.selected}
    labelProp="label"
    valueProp="id"
  >
    <div slot="below-listbox">
      <button type="button" on:click={() => resetDefaultTabs()}>
        <i class="fas fa-rotate-right" />
        {localize('T5EK.UseDefault')}
      </button>
    </div>
  </ListboxSetting>
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
