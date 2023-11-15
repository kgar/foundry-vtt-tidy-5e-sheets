<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('T5EK.Settings.TabInfo.Header')}</h2>
<p>
  {@html localize('T5EK.Settings.TabInfo.MaintainerParagraph', {
    urlStart: '<a href="https://github.com/kgar" target="_blank">',
    urlEnd: '</a>',
  })}
</p>
<p>
  {@html localize('T5EK.Settings.TabInfo.GithubParagraph', {
    urlStart:
      '<a href="https://github.com/kgar/foundry-vtt-tidy-5e-sheets/issues" target="_blank">',
    urlEnd: '</a>',
  })}
</p>

<h3>{localize('T5EK.Settings.TabInfo.FinancialSupportHeader')}</h3>
<p>
  {@html localize('T5EK.Settings.TabInfo.DiscordParagraph', {
    urlStart: '<a href="https://discord.gg/kdqbcWJrYU" target="_blank">',
    urlEnd: '</a>',
  })}
</p>
<p>
  {@html localize('T5EK.Settings.TabInfo.LocalizationParagraph', {
    urlStart: '<a href="https://weblate.foundryvtt-hub.com/" target="_blank">',
    urlEnd: '</a>',
  })}
</p>
<p>
  {localize('T5EK.Settings.TabInfo.FinancialSupportParagraph')}
</p>
<ul>
  <li>
    {@html localize('T5EK.Settings.TabInfo.BuyMeACoffeeLink', {
      urlStart: '<a href="https://www.buymeacoffee.com/kgar" target="_blank">',
      urlEnd: '</a>',
    })}
  </li>
  <li>
    {@html localize('T5EK.Settings.TabInfo.KoFiLink', {
      urlStart: '<a href="https://ko-fi.com/iamkgar" target="_blank">',
      urlEnd: '</a>',
    })}
  </li>
  <li>
    {@html localize('T5EK.Settings.TabInfo.PatreonLink', {
      urlStart: '<a href="https://www.patreon.com/iamkgar" target="_blank">',
      urlEnd: '</a>',
    })}
  </li>
</ul>
