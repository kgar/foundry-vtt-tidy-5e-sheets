<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
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

<div
  class="flexrow flex1"
  style="gap: 0.75rem; justify-content: end; margin-top: 0.5rem;"
>
  <h3 class="flex1">
    {localize('TIDY5E.SettingsMenu.HeaderControlConfiguration.name')}
  </h3>
  <button
    type="button"
    class="button button-borderless flexshrink"
    style="padding: 0;"
    onclick={() => {
      config.controlSettings.forEach((setting) => {
        setting.location = 'menu';
      });
    }}
  >
    <i class="fas fa-square-list"></i>
    {localize('TIDY5E.Listbox.MoveAllLeft')}
  </button>
  <button
    type="button"
    class="button button-borderless flexshrink"
    style="padding: 0;"
    onclick={() => {
      config.controlSettings.forEach((setting) => {
        setting.location = 'header';
      });
    }}
  >
    <i class="fas fa-ellipsis"></i>
    {localize('TIDY5E.Listbox.MoveAllRight')}
  </button>
</div>
<tidy-gold-header-underline style="margin-bottom: 0.5rem;"
></tidy-gold-header-underline>
<fieldset>
  {#each config.controlSettings as setting}
    {@const formControlId = `${idPrefix}-${setting.title.slugify()}`}
    <div class="form-group">
      <label for={formControlId}>
        <i class={setting.icon}></i>
        {setting.title}
      </label>
      <div class="form-fields" style="flex-start; gap: 1.5rem; flex-grow: 0;">
        <label class="radio">
          <input
            type="radio"
            checked={setting.location === 'menu'}
            onclick={() => {
              setting.location = 'menu';
            }}
          />
          {menuOptionText}
        </label>
        <label class="radio">
          <input
            type="radio"
            checked={setting.location === 'header'}
            onclick={() => {
              setting.location = 'header';
            }}
          />
          {headerOptionText}
        </label>
      </div>
    </div>
  {/each}
</fieldset>
