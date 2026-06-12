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

<div class="dialog-content-container world-settings-overview flexcol">
  <FiligreeCard>
    <div class="tidy-info-banner">
      <a href="https://foundryvtt.com/packages/tidy5e-sheet/" target="_blank">
        <img
          class="logo"
          src="../modules/tidy5e-sheet/images/tidy-shield-large.webp"
          alt={localize('TIDY5E.Settings.About.logoAltText')}
        />
      </a>
      <p class="banner-text font-body-large">
        {@html localize('TIDY5E.WorldSettings.Defaults.intro')}
      </p>
    </div>
  </FiligreeCard>

  <fieldset>
    <legend>
      <h2>{localize('TIDY5E.WorldSettings.SheetPreferences.name')}</h2>
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    <p class="settings-description">
      {localize('TIDY5E.WorldSettings.SheetPreferences.hint')}
    </p>

    <div class="flexrow setting-actions">
      <button
        type="button"
        class="button button-primary button-large"
        onclick={() => useTidyForAllSheets()}
      >
        <i class="fas fa-check-double"></i>
        {localize('TIDY5E.WorldSettings.SheetPreferences.switchToTidySheets')}
      </button>
      <button
        type="button"
        class="button button-secondary button-large choose-specific-btn"
        onclick={() => chooseSpecificSheets()}
      >
        {localize('TIDY5E.WorldSettings.SheetPreferences.chooseSpecific')}
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
      {@html localize('TIDY5E.Settings.About.GithubParagraph', {
        urlStart:
          '<a href="https://github.com/kgar/foundry-vtt-tidy-5e-sheets/issues" target="_blank">',
        urlEnd: '</a>',
      })}
    </p>

    <h3>Join the Discord Server</h3>
    <p class="settings-description">
      {@html localize('TIDY5E.Settings.About.DiscordParagraph', {
        urlStart:
          '<a href="https://discord.gg/kdqbcWJrYU" target="_blank">',
        urlEnd: '</a>',
      })}
    </p>

    <h3>Help Translate the Module</h3>
    <p class="settings-description">
      {@html localize('TIDY5E.Settings.About.LocalizationParagraph', {
        urlStart:
          '<a href="https://hosted.weblate.org/projects/foundry-vtt-tidy-5e-sheets/" target="_blank">',
        urlEnd: '</a>',
      })}
    </p>

    <h3>Support the Developer</h3>
    <p class="settings-description">
      {@html localize('TIDY5E.Settings.About.MaintainerParagraph', {
        urlStart: '<a href="https://github.com/kgar" target="_blank">',
        urlEnd: '</a>',
      })}
    </p>
    <p class="settings-description">
      {@html localize('TIDY5E.Settings.About.FinancialSupportParagraph', {
        urlStart:
          '<a href="https://www.buymeacoffee.com/kgar" target="_blank">',
        urlEnd: '</a>',
      })}
    </p>  
    <ul class="settings-description-list">
      <li>
        {@html localize('TIDY5E.Settings.About.BuyMeACoffeeLink', {
          urlStart: '<a href="https://www.buymeacoffee.com/kgar" target="_blank">',
          urlEnd: '</a>',
        })}
      </li>
      <li>
        {@html localize('TIDY5E.Settings.About.KoFiLink', {
          urlStart: '<a href="https://ko-fi.com/iamkgar" target="_blank">',
          urlEnd: '</a>',
        })}
      </li>
    </ul>
  </fieldset>

  <fieldset>
    <legend>
      <h2>{localize('TIDY5E.Settings.Reset.name')}</h2>
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    <p class="settings-description">
      {localize('TIDY5E.WorldSettings.Defaults.resetHint')}
    </p>

    <div class="flexrow setting-actions">
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