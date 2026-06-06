<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { clickOutside } from 'src/events/clickOutside.svelte';
  import type { HeaderControlConfigContextItem } from './WorldHeaderControlConfigurationQuadroneApplication.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';

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

<TidyTable key={`${idPrefix}-header-controls`} toggleable={false} class="sheet-preferences-table">
  {#snippet header()}
    <TidyTableHeaderRow class="unset-header-height theme-dark">
      <TidyTableHeaderCell primary={true}>
        <h3 class="sheet-preferences-label">
          {localize('TIDY5E.SettingsMenu.HeaderControlConfiguration.name')}
        </h3>
      </TidyTableHeaderCell>
      <TidyTableHeaderCell class="sheet-preferences-column-label" columnWidth="8rem">
        <i class="fas fa-square-list header-cell-icon"></i>
        <span class="header-cell-label">
          {localize('TIDY5E.SheetSettings.HeaderControls.ShowControl', { location: localize('TIDY5E.HeaderControlConfiguration.LocationMenu') })}
        </span>
      </TidyTableHeaderCell>
      <TidyTableHeaderCell class="sheet-preferences-column-label" columnWidth="8rem">
        <i class="fas fa-ellipsis-horizontal header-cell-icon"></i>
        <span class="header-cell-label">
          {localize('TIDY5E.SheetSettings.HeaderControls.ShowControl', { location: localize('TIDY5E.HeaderControlConfiguration.LocationHeader') })}
        </span>
      </TidyTableHeaderCell>
    </TidyTableHeaderRow>
  {/snippet}
  {#snippet body()}
    {#each config.controlSettings as setting (setting.id)}
      {@const formControlId = `${idPrefix}-${setting.title.slugify()}`}
      <TidyTableRow>
        <TidyTableCell primary={true}>
          <label for={formControlId}>
            <i class={setting.icon}></i>
            {setting.title}
          </label>
        </TidyTableCell>
        <TidyTableCell columnWidth="8rem">
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
        </TidyTableCell>
        <TidyTableCell columnWidth="8rem">
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
        </TidyTableCell>
      </TidyTableRow>
    {/each}
  {/snippet}
</TidyTable>

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
