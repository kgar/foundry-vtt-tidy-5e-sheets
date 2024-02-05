<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('TIDY5E.Settings.TabInfo.Header')}</h2>
<p>
  {@html localize('TIDY5E.Settings.TabInfo.MaintainerParagraph', {
    urlStart: '<a href="https://github.com/kgar" target="_blank">',
    urlEnd: '</a>',
  })}
</p>
<p>
  {@html localize('TIDY5E.Settings.TabInfo.GithubParagraph', {
    urlStart:
      '<a href="https://github.com/kgar/foundry-vtt-tidy-5e-sheets/issues" target="_blank">',
    urlEnd: '</a>',
  })}
</p>

<h3>{localize('TIDY5E.Settings.TabInfo.FinancialSupportHeader')}</h3>
<p>
  {@html localize('TIDY5E.Settings.TabInfo.DiscordParagraph', {
    urlStart: '<a href="https://discord.gg/kdqbcWJrYU" target="_blank">',
    urlEnd: '</a>',
  })}
</p>
<p>
  {@html localize('TIDY5E.Settings.TabInfo.LocalizationParagraph', {
    urlStart: '<a href="https://hosted.weblate.org/projects/foundry-vtt-tidy-5e-sheets/" target="_blank">',
    urlEnd: '</a>',
  })}
</p>
<p>
  {localize('TIDY5E.Settings.TabInfo.FinancialSupportParagraph')}
</p>
<ul>
  <li>
    {@html localize('TIDY5E.Settings.TabInfo.BuyMeACoffeeLink', {
      urlStart: '<a href="https://www.buymeacoffee.com/kgar" target="_blank">',
      urlEnd: '</a>',
    })}
  </li>
  <li>
    {@html localize('TIDY5E.Settings.TabInfo.KoFiLink', {
      urlStart: '<a href="https://ko-fi.com/iamkgar" target="_blank">',
      urlEnd: '</a>',
    })}
  </li>
  <li>
    {@html localize('TIDY5E.Settings.TabInfo.PatreonLink', {
      urlStart: '<a href="https://www.patreon.com/iamkgar" target="_blank">',
      urlEnd: '</a>',
    })}
  </li>
</ul>
