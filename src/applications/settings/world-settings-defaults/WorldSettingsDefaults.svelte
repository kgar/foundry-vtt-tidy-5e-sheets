<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    WorldSettingsTabIds,
    type WorldSettingsQuadroneApplication,
  } from 'src/applications/settings/world/TidyWorldSettingsQuadroneApplication.svelte';
  import { CONSTANTS } from 'src/constants';
  import { log } from 'src/utils/logging';

  interface Props {
    app: WorldSettingsQuadroneApplication;
  }

  let { app }: Props = $props();

  const localize = FoundryAdapter.localize;

  async function useTidyForAllSheets() {
    app.sheetPreferencesTab.sheetOptions.forEach((o) => (o.selected = true));
    await app.sheetPreferencesTab._onConfirm();
  }

  function chooseSpecificSheets() {
    app.selectTab(WorldSettingsTabIds.sheetPreferences);
  }

  async function resetToDefaults() {
    const proceed = await foundry.applications.api.DialogV2.confirm({
      window: {
        title: localize('TIDY5E.Settings.Reset.dialogs.title'),
      },
      content: `<p>${localize('TIDY5E.Settings.Reset.dialogs.content')}</p>`,
    });

    if (!proceed) {
      return;
    }

    const storedSettings = game.settings.storage
      .get('world')
      .filter((setting: any) =>
        setting.key.startsWith(`${CONSTANTS.MODULE_ID}.`),
      );

    for (let setting of storedSettings) {
      log(`Reset setting '${setting.key}'`);
      await setting.delete();
    }
  }
</script>

<div class="dialog-content-container flexcol">
  <div class="tidy-info-banner">
    <a href="https://foundryvtt.com/packages/tidy5e-sheet/" target="_blank">
      <img
        class="logo"
        src="../modules/tidy5e-sheet/images/tidy-shield-large.webp"
        alt={localize('TIDY5E.Settings.About.logoAltText')}
      />
    </a>
    <p class="banner-text">
      {localize('TIDY5E.WorldSettings.Defaults.intro')}
    </p>
  </div>

  <fieldset>
    <legend>
      <h2>{localize('TIDY5E.Settings.SheetPreferences.name')}</h2>
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    <p class="hint">
      {localize('TIDY5E.WorldSettings.Defaults.useTidyHint')}
    </p>

    <div class="flexcol setting-actions">
      <button
        type="button"
        class="button button-primary button-large"
        onclick={() => useTidyForAllSheets()}
      >
        <i class="fas fa-check-double"></i>
        {localize('TIDY5E.Settings.SheetPreferences.enableAll')}
      </button>
      <button
        type="button"
        class="button button-borderless choose-specific-btn"
        onclick={() => chooseSpecificSheets()}
      >
        {localize('TIDY5E.WorldSettings.Defaults.chooseSpecific')}
      </button>
    </div>
  </fieldset>

  <fieldset>
    <legend>
      <h2>{localize('TIDY5E.Settings.Reset.name')}</h2>
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    <p class="hint">
      {localize('TIDY5E.WorldSettings.Defaults.resetHint')}
    </p>

    <div class="flexcol setting-actions">
      <button
        type="button"
        class="button button-secondary button-large reset-defaults-btn"
        onclick={() => resetToDefaults()}
      >
        <i class="fas fa-broom-wide"></i>
        {localize('TIDY5E.Settings.Reset.name')}
      </button>
    </div>
  </fieldset>
</div>

<style lang="less">
  .tidy-info-banner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: -0.5rem;
    margin-left: -0.5rem;
    margin-right: -0.5rem;
    margin-bottom: 1rem;
    min-height: 10rem;
    padding-left: 2rem;
    padding-right: 2rem;
    text-align: center;
  }

  .logo {
    max-width: 7.5rem;
    animation: TheShining 16s infinite;
  }

  .setting-actions {
    gap: 0.5rem;
    align-items: flex-start;
  }

  .choose-specific-btn {
    padding: 0;
    align-self: flex-start;
  }

  @keyframes TheShining {
    0% {
      filter: drop-shadow(0 0 0.625rem var(--t5e-primary-accent-color));
    }
    50% {
      filter: drop-shadow(0 0 5rem var(--t5e-primary-accent-color))
        hue-rotate(90deg);
    }
    100% {
      filter: drop-shadow(0 0 0.625rem var(--t5e-primary-accent-color))
        hue-rotate(360deg);
    }
  }
</style>
