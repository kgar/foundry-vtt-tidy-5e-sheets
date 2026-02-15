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

  const idPrefix = foundry.utils.randomID();
</script>

<div class="dialog-content-container flexcol">
  <div class="flexcol flex1">
    <fieldset>
      <legend>
        <h2>{localize('TIDY5E.Settings.BankedInspiration.title')}</h2>
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
  
      <div class="form-group slim">
        <label for="banked-inspiration-{idPrefix}">
          {localize('TIDY5E.Settings.EnableBankedInspiration.name')}
        </label>
        <div class="form-fields">
          <input
            id="banked-inspiration-{idPrefix}"
            type="checkbox"
            bind:checked={config.enableBankedInspiration}
          />
        </div>
        <p class="hint">
          {localize('TIDY5E.Settings.EnableBankedInspiration.hint')}
        </p>
      </div>
      <div class="form-group slim">
        <label for="banked-inspiration-gm-only-{idPrefix}">
          {localize('TIDY5E.Settings.BankedInspirationGmOnly.name')}
        </label>
        <div class="form-fields">
          <input
            id="banked-inspiration-gm-only-{idPrefix}"
            type="checkbox"
            bind:checked={config.bankedInspirationGmOnly}
          />
        </div>
        <p class="hint">
          {localize('TIDY5E.Settings.BankedInspirationGmOnly.hint')}
        </p>
      </div>
    </fieldset>
  </div>
</div>
<div class="button-bar">
  <button
    type="button"
    class="button button-primary button-large button-save save-changes-btn"
    onclick={() => app.save()}
  >
    <i class="fas fa-save"></i>
    {localize('TIDY5E.SaveChanges')}
  </button>
</div>
