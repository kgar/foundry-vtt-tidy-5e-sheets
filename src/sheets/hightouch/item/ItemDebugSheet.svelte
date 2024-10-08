<script lang="ts">
  import TidySwitch from 'src/components/toggle/TidySwitch.svelte';
  import { CONSTANTS } from 'src/constants';
  import { SettingsProvider } from 'src/settings/settings';
  import { defaultDarkTheme } from 'src/theme/default-dark-theme';
  import { getThemeOrDefault } from 'src/theme/theme';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemDebugSheetHightouchContext } from '../Tidy5eItemDebugSheetHightouch';

  let context = getContext<Readable<ItemDebugSheetHightouchContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: theme = getThemeOrDefault(SettingsProvider.settings.colorScheme.get());

  function selectTheme(themeId: string) {
    game.settings.set(CONSTANTS.MODULE_ID, 'colorScheme', themeId);
  }
</script>

<aside class="sidebar inverse">
  <h4>Theme</h4>
  <div style="display: flex; flex-direction: column; gap: 0.25rem">
    <label for="light-mode-toggle">
      <input
        id="light-mode-toggle"
        type="radio"
        name="theme-selector"
        value={CONSTANTS.THEME_ID_DEFAULT_LIGHT}
        checked={theme.id === CONSTANTS.THEME_ID_DEFAULT_LIGHT}
        on:click={(ev) => selectTheme(CONSTANTS.THEME_ID_DEFAULT_LIGHT)}
      />
      <!-- svelte-ignore missing-declaration -->
      {game.i18n.localize('TIDY5E.Settings.SheetTheme.light')}
    </label>
    <label for="dark-mode-toggle">
      <input
        id="dark-mode-toggle"
        type="radio"
        name="theme-selector"
        value={CONSTANTS.THEME_ID_DEFAULT_DARK}
        checked={theme.id === CONSTANTS.THEME_ID_DEFAULT_DARK}
        on:click={(ev) => selectTheme(CONSTANTS.THEME_ID_DEFAULT_DARK)}
      />
      <!-- svelte-ignore missing-declaration -->
      {game.i18n.localize('TIDY5E.Settings.SheetTheme.dark')}
    </label>
  </div>
</aside>
<div class="item-content controls-gallery">
  <fieldset>
    <legend> Button / Attention </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Button / Default </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Button / Icon Only </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Button / Icon Only Menu </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Button / Edit Description </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Button / Group </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Button / Toggle </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Category / Spell context icon </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Data / Spell Components </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Data / Time </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Data / Uses </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Enricher </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Field </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Filigree box </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Input / Checkbox </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Input / Document Name </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend>Input / Radio</legend>

    <ul class="unlist">
      <li>
        <input type="radio" name="test" id="test-1" checked={true} />
        <label for="test-1">Property</label>
      </li>
      <li>
        <input type="radio" name="test" id="test-2" />
        <label for="test-2">Property</label>
      </li>
      <li>
        <input type="radio" name="test" id="test-2" disabled />
        <label for="test-3">Property with line breaks</label>
      </li>
    </ul>
  </fieldset>

  <fieldset>
    <legend> Input / Search </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Input / Select </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend>Input / Switch</legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend>Input / Switch - Edit Sheet</legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend>Input / Switch / Sheet Lock</legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Input / Text </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Input / Text with Icon </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Input / Text with Label </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Pill </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Pill / Readonly </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Pill / Switch </legend>

    <!-- TODO -->
  </fieldset>
</div>

<style lang="scss">
  .controls-gallery {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;

    > * {
      flex: 1 0 min-content;
    }

    legend {
      white-space: nowrap;
    }
  }

  .radio-button-and-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    line-height: 2;
  }
</style>
