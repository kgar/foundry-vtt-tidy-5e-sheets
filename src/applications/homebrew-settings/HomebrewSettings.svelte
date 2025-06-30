<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    HomebrewConfigContext,
    HomebrewSettingsApplication,
  } from './HomebrewSettingsApplication.svelte';

  interface Props {
    config: HomebrewConfigContext;
    app: HomebrewSettingsApplication;
  }

  let { config, app }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<div class="flexcol flex1">
  <fieldset>
    <legend>
      {localize('TIDY5E.Settings.BankedInspiration.title')}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    <div class="form-group">
      <label for="">
        {localize('TIDY5E.Settings.EnableBankedInspiration.name')}
      </label>
      <div class="form-fields">
        <input type="checkbox" bind:checked={config.enableBankedInspiration} />
      </div>
      <p class="hint">
        {localize('TIDY5E.Settings.EnableBankedInspiration.hint')}
      </p>
    </div>
    <div class="form-group">
      <label for="">
        {localize('TIDY5E.Settings.BankedInspirationGmOnly.name')}
      </label>
      <div class="form-fields">
        <input type="checkbox" bind:checked={config.bankedInspirationGmOnly} />
      </div>
      <p class="hint">
        {localize('TIDY5E.Settings.BankedInspirationGmOnly.hint')}
      </p>
    </div>
  </fieldset>
</div>
<div class="flexrow flex0">
  <button
    type="button"
    class="button button-primary save-changes-btn"
    onclick={() => app.save()}
  >
    {localize('TIDY5E.SaveChanges')}
  </button>
</div>
