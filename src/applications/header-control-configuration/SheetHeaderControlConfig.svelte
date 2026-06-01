<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { clickOutside } from 'src/events/clickOutside.svelte';
  import type { HeaderControlConfigContextItem } from './WorldHeaderControlConfigurationQuadroneApplication.svelte';

  interface Props {
    config: HeaderControlConfigContextItem;
    idPrefix: string;
  }

  let { config, idPrefix }: Props = $props();

  const localize = FoundryAdapter.localize;

  const menuOptionText = localize(
    'TIDY5E.HeaderControlConfiguration.LocationMenu',
  );
  const headerOptionText = localize(
    'TIDY5E.HeaderControlConfiguration.LocationHeader',
  );
</script>

<div class="header-controls-preview">
  <div class="header-controls-preview-label font-label-medium">{localize('TIDY5E.SheetSettings.HeaderControls.Preview')}</div>
  <button
    aria-label={localize('APPLICATION.TOOLS.ToggleControls')}
    type="button"
    class="button button-icon-only button-borderless"
    data-tooltip={localize('APPLICATION.TOOLS.ToggleControls')}
  >
    <i class="fas fa-ellipsis-vertical"></i>
  </button>
  {#each config.controlSettings.filter((setting) => setting.location === 'header') as setting}
    <button aria-label={setting.title} type="button" data-tooltip={setting.title} class="button button-icon-only button-borderless">
      <i class={setting.icon}></i>
    </button>
  {/each}
  <button aria-label={localize('APPLICATION.TOOLS.Close')} type="button" class="button button-icon-only button-borderless" data-tooltip={localize('APPLICATION.TOOLS.Close')}>
    <i class="fas fa-close"></i>
  </button>
</div>

<table class="header-controls-table">
  <thead>
    <tr>
    <th>
      <h3 class="header-controls-label">
        {localize('TIDY5E.SettingsMenu.HeaderControlConfiguration.name')}
      </h3>
      </th>
      <th class="header-controls-column-label">
        <i class="fas fa-square-list"></i>
        {localize('TIDY5E.SheetSettings.HeaderControls.ShowControl', { location: localize('TIDY5E.HeaderControlConfiguration.LocationMenu') })}
      </th>
      <th class="header-controls-column-label">
        <i class="fas fa-ellipsis-vertical"></i>
        {localize('TIDY5E.SheetSettings.HeaderControls.ShowControl', { location: localize('TIDY5E.HeaderControlConfiguration.LocationHeader') })}
      </th>
    </tr>
  </thead>
  <tbody class="header-controls-list">
    {#each config.controlSettings as setting}
      {@const formControlId = `${idPrefix}-${setting.title.slugify()}`}
      <tr>
        <td>
          <label for={formControlId}>
            <i class={setting.icon}></i>
            {setting.title}
          </label>
        </td>
        <td>
          <label class="radio">
            <input
              type="radio"
              checked={setting.location === 'menu'}
              onclick={() => {
                setting.location = 'menu';
              }}
            />
            <span class="hidden">{menuOptionText}</span>
          </label>
        </td>
        <td>
          <label class="radio">
            <input
              type="radio"
              checked={setting.location === 'header'}
              onclick={() => {
                setting.location = 'header';
              }}
            />
            <span class="hidden">{headerOptionText}</span>
          </label>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<div class="controls-row">
  <button
    type="button"
    class="button button-secondary"
    onclick={() => {
      config.controlSettings.forEach((setting) => {
        setting.location = 'menu';
      });
    }}
  >
    <i class="fas fa-square-list"></i>
    {localize('TIDY5E.SheetSettings.HeaderControls.MoveAllToMenu')}
  </button>
  <button
    type="button"
    class="button button-secondary"
    onclick={() => {
      config.controlSettings.forEach((setting) => {
        setting.location = 'header';
      });
    }}
  >
    <i class="fas fa-ellipsis-vertical"></i>
    {localize('TIDY5E.SheetSettings.HeaderControls.MoveAllToHeader')}
  </button>
</div>
