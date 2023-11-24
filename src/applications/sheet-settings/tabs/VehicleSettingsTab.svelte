<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/sheet-settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { SettingsProvider } from 'src/settings/settings';
  import NumberInputSetting from 'src/applications/sheet-settings/parts/NumberInputSetting.svelte';
  import SelectSetting from '../parts/SelectSetting.svelte';
  import type { SettingsSheetContext } from '../SheetSettingsFormApplication';
  import SelectionListbox from 'src/components/listbox/SelectionListbox.svelte';

  let context = getContext<Writable<SettingsSheetContext>>('context');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;

  // TODO: Put on application class and generalize if able
  function resetDefaultTabs(): any {
    const defaultVehicleTabs = [
      ...SettingsProvider.settings.defaultVehicleSheetTabs.options.default,
    ] as string[];
    const available = $context.availableVehicleTabs
      .filter((t) => !defaultVehicleTabs.includes(t.id))
      .concat(
        $context.selectedVehicleTabs.filter(
          (t) => !defaultVehicleTabs.includes(t.id),
        ),
      );
    const selected = $context.availableVehicleTabs
      .filter((t) => defaultVehicleTabs.includes(t.id))
      .concat(
        $context.selectedVehicleTabs.filter((t) =>
          defaultVehicleTabs.includes(t.id),
        ),
      )
      .sort(
        (a, b) =>
          defaultVehicleTabs.indexOf(a.id) - defaultVehicleTabs.indexOf(b.id),
      );
    $context.availableVehicleTabs = available;
    $context.selectedVehicleTabs = selected;
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
          bind:leftItems={$context.availableVehicleTabs}
          bind:rightItems={$context.selectedVehicleTabs}
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
