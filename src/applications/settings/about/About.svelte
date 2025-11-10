<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  const localize = FoundryAdapter.localize;
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
      {@html localize('TIDY5E.Settings.About.MaintainerParagraph', {
        urlStart: '<a href="https://github.com/kgar" target="_blank">',
        urlEnd: '</a>',
      })}
    </p>
  </div>
  <p>
    {@html localize('TIDY5E.Settings.About.GithubParagraph', {
      urlStart:
        '<a href="https://github.com/kgar/foundry-vtt-tidy-5e-sheets/issues" target="_blank">',
      urlEnd: '</a>',
    })}
  </p>
  
  <h3>{localize('TIDY5E.Settings.About.FinancialSupportHeader')}</h3>
  <p>
    {@html localize('TIDY5E.Settings.About.DiscordParagraph', {
      urlStart: '<a href="https://discord.gg/kdqbcWJrYU" target="_blank">',
      urlEnd: '</a>',
    })}
  </p>
  <p>
    {@html localize('TIDY5E.Settings.About.LocalizationParagraph', {
      urlStart:
        '<a href="https://hosted.weblate.org/projects/foundry-vtt-tidy-5e-sheets/" target="_blank">',
      urlEnd: '</a>',
    })}
  </p>
  <p>
    {localize('TIDY5E.Settings.About.FinancialSupportParagraph')}
  </p>
  <ul>
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
    <li>
      {@html localize('TIDY5E.Settings.About.PatreonLink', {
        urlStart: '<a href="https://www.patreon.com/iamkgar" target="_blank">',
        urlEnd: '</a>',
      })}
    </li>
  </ul>
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
  }

  .logo {
    max-width: 7.5rem;
    animation: TheShining 16s infinite;
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
