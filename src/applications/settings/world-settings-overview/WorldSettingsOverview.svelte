<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    WorldSettingsTabIds,
    type WorldSettingsQuadroneApplication,
  } from 'src/applications/settings/world/TidyWorldSettingsQuadroneApplication.svelte';
  import { CONSTANTS } from 'src/constants';
  import { log } from 'src/utils/logging';
  import FiligreeCard from 'src/components/filigree-card/FiligreeCard.svelte';

  interface Props {
    app: WorldSettingsQuadroneApplication;
  }

  let { app }: Props = $props();

  const localize = FoundryAdapter.localize;

  async function useTidyForAllSheets() {
    app.editors.sheetPreferencesTab.value.forEach((o) => (o.selected = true));
    await app.editors.sheetPreferencesTab.save();
  }

  function chooseSpecificSheets() {
    app.selectTab(WorldSettingsTabIds.sheetPreferences);
  }

  async function resetToDefaults() {
    const proceed = await foundry.applications.api.DialogV2.confirm({
      window: {
        title: localize('TIDY5E.SETTINGS.Reset.Dialog.Title'),
      },
      content: `<p>${localize('TIDY5E.SETTINGS.Reset.Dialog.Content')}</p>`,
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

<div class="dialog-content-container world-settings-overview flexcol">
  <FiligreeCard>
    <div class="tidy-info-banner">
      <a href="https://foundryvtt.com/packages/tidy5e-sheet/" target="_blank">
        <img
          class="logo"
          src="../modules/tidy5e-sheet/images/tidy-shield-large.webp"
          alt={localize('TIDY5E.SETTINGS.About.LogoAltText')}
        />
      </a>
      <p class="banner-text font-body-large">
        {@html localize('TIDY5E.SETTINGS.World.Defaults.Intro')}
      </p>
    </div>
  </FiligreeCard>

  <fieldset>
    <legend>
      <h2>{localize('TIDY5E.SETTINGS.Preference.World.name')}</h2>
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    <p class="settings-description">
      {localize('TIDY5E.SETTINGS.Preference.World.hint')}
    </p>

    <div class="flexrow setting-actions">
      <button
        type="button"
        class="button button-primary button-large"
        onclick={() => useTidyForAllSheets()}
      >
        <i class="fas fa-check-double"></i>
        {localize('TIDY5E.SETTINGS.Preference.World.Action.SwitchToTidy')}
      </button>
      <button
        type="button"
        class="button button-secondary button-large choose-specific-btn"
        onclick={() => chooseSpecificSheets()}
      >
        {localize('TIDY5E.SETTINGS.Preference.World.Action.ChooseSpecific')}
      </button>
    </div>
  </fieldset>

  <fieldset>
    <legend>
      <h2>Join the Community</h2>
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    <h3>Report an Issue or Suggest a Feature</h3>
    <p class="settings-description">
      {@html localize('TIDY5E.SETTINGS.About.Github', {
        urlStart:
          '<a href="https://github.com/kgar/foundry-vtt-tidy-5e-sheets/issues" target="_blank">',
        urlEnd: '</a>',
      })}
    </p>

    <h3>Join the Discord Server</h3>
    <p class="settings-description">
      {@html localize('TIDY5E.SETTINGS.About.Discord', {
        urlStart:
          '<a href="https://discord.gg/kdqbcWJrYU" target="_blank">',
        urlEnd: '</a>',
      })}
    </p>

    <h3>Help Translate the Module</h3>
    <p class="settings-description">
      {@html localize('TIDY5E.SETTINGS.About.Localization', {
        urlStart:
          '<a href="https://hosted.weblate.org/projects/foundry-vtt-tidy-5e-sheets/" target="_blank">',
        urlEnd: '</a>',
      })}
    </p>

    <h3>Support the Developer</h3>
    <p class="settings-description">
      {@html localize('TIDY5E.SETTINGS.About.Maintainer', {
        urlStart: '<a href="https://github.com/kgar" target="_blank">',
        urlEnd: '</a>',
      })}
    </p>
    <p class="settings-description">
      {@html localize('TIDY5E.SETTINGS.About.FinancialSupport', {
        urlStart:
          '<a href="https://www.buymeacoffee.com/kgar" target="_blank">',
        urlEnd: '</a>',
      })}
    </p>  
    <ul class="settings-description-list">
      <li>
        {@html localize('TIDY5E.SETTINGS.About.Link.BuyMeACoffee', {
          urlStart: '<a href="https://www.buymeacoffee.com/kgar" target="_blank">',
          urlEnd: '</a>',
        })}
      </li>
      <li>
        {@html localize('TIDY5E.SETTINGS.About.Link.KoFi', {
          urlStart: '<a href="https://ko-fi.com/iamkgar" target="_blank">',
          urlEnd: '</a>',
        })}
      </li>
    </ul>
  </fieldset>

  <fieldset>
    <legend>
      <h2>{localize('TIDY5E.SETTINGS.Reset.name')}</h2>
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    <p class="settings-description">
      {localize('TIDY5E.SETTINGS.World.Defaults.ResetHint')}
    </p>

    <div class="flexrow setting-actions">
      <button
        type="button"
        class="button button-secondary button-large reset-defaults-btn"
        onclick={() => resetToDefaults()}
      >
        <i class="fas fa-broom-wide"></i>
        {localize('TIDY5E.SETTINGS.Reset.name')}
      </button>
    </div>
  </fieldset>
</div>