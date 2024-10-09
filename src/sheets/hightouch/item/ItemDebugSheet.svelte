<script lang="ts">
  import TidySwitch from 'src/components/toggle/TidySwitch.svelte';
  import { CONSTANTS } from 'src/constants';
  import { SettingsProvider } from 'src/settings/settings';
  import { defaultDarkTheme } from 'src/theme/default-dark-theme';
  import { getThemeOrDefault } from 'src/theme/theme';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemDebugSheetHightouchContext } from '../Tidy5eItemDebugSheetHightouch';
  import ButtonWithOptionPanel from 'src/components/buttons/ButtonWithOptionPanel.svelte';

  let context = getContext<Readable<ItemDebugSheetHightouchContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: theme = getThemeOrDefault(SettingsProvider.settings.colorScheme.get());

  let inverse = false;

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
  <h4>Inversion</h4>
  <div style="display: flex; flex-direction: column; gap: 0.25rem">
    <label for="default-mode-toggle">
      <input
        id="default-mode-toggle"
        type="radio"
        name="inversion-mode-selector"
        value={CONSTANTS.VIEW_MODE_DEFAULT}
        checked={!inverse}
        on:click={() => (inverse = false)}
      />
      Default
    </label>
    <label for="inverse-mode-toggle">
      <input
        id="inverse-mode-toggle"
        type="radio"
        name="inversion-mode-selector"
        value={CONSTANTS.VIEW_MODE_INVERSE}
        checked={inverse}
        on:click={() => (inverse = true)}
      />
      Inverse
    </label>
  </div>
</aside>
<div class="item-content controls-gallery" class:inverse>
  <fieldset class="vertical-gallery">
    <legend> Button / Attention </legend>

    <!-- svelte-ignore a11y-missing-attribute -->
    Anchor
    <a class="button active">
      <i class="fas fa-edit"></i>
      Edit Details
    </a>
    Button
    <button class="active">
      <i class="fas fa-edit"></i>
      Edit Details
    </button>
  </fieldset>

  <fieldset class="vertical-gallery">
    <legend> Button / Default </legend>

    <!-- svelte-ignore a11y-missing-attribute -->
    Anchor
    <a class="button">
      <i class="fas fa-edit"></i>
      Edit Details
    </a>
    Button
    <button>
      <i class="fas fa-edit"></i>
      Edit Details
    </button>
  </fieldset>

  <fieldset style="display: flex; gap: 0.5rem;">
    <legend> Button / Icon Only </legend>

    <div class="vertical-gallery">
      Anchors
      <!-- svelte-ignore a11y-missing-attribute -->
      <a class="button icon-button">
        <i class="fas fa-hand"></i>
      </a>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a class="button icon-button active">
        <i class="fas fa-hand"></i>
      </a>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a class="button icon-button disabled">
        <i class="fas fa-hand"></i>
      </a>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a class="button icon-button active disabled">
        <i class="fas fa-hand"></i>
      </a>
    </div>
    <div class="vertical-gallery">
      Buttons
      <!-- svelte-ignore a11y-missing-attribute -->
      <button class="icon-button">
        <i class="fas fa-hand"></i>
      </button>
      <!-- svelte-ignore a11y-missing-attribute -->
      <button class="icon-button active">
        <i class="fas fa-hand"></i>
      </button>
      <!-- svelte-ignore a11y-missing-attribute -->
      <button class="icon-button disabled">
        <i class="fas fa-hand"></i>
      </button>
      <!-- svelte-ignore a11y-missing-attribute -->
      <button class="icon-button active disabled">
        <i class="fas fa-hand"></i>
      </button>
    </div>
  </fieldset>

  <fieldset>
    <legend> Button / Icon Only Menu </legend>

    <div class="wrapped-gallery">
      <ButtonWithOptionPanel class="icon-button">
        <i class="fas fa-hand"></i>
        <svelte:fragment slot="options">
          <label>
            <input type="radio" name="icon-menu-test" value="1" /> Test Option 1
          </label>
          <label>
            <input type="radio" name="icon-menu-test" value="2" /> Test Option 2
          </label>
        </svelte:fragment>
      </ButtonWithOptionPanel>
      <ButtonWithOptionPanel class="icon-button active">
        <i class="fas fa-hand"></i>
        <svelte:fragment slot="options">O hai 🙋‍♀️</svelte:fragment>
      </ButtonWithOptionPanel>
      <ButtonWithOptionPanel class="icon-button disabled">
        <i class="fas fa-hand"></i>
        <svelte:fragment slot="options">O hai 🙋‍♀️</svelte:fragment>
      </ButtonWithOptionPanel>
      <ButtonWithOptionPanel class="icon-button active disabled">
        <i class="fas fa-hand"></i>
        <svelte:fragment slot="options">O hai 🙋‍♀️</svelte:fragment>
      </ButtonWithOptionPanel>
    </div>
  </fieldset>

  <fieldset>
    <legend> Button / Edit Description </legend>

    <!-- svelte-ignore a11y-missing-attribute -->
    <a class="button icon-button">
      <i class="fa-solid fa-feather"></i>
    </a>
    <!-- svelte-ignore a11y-missing-attribute -->
    <a class="button icon-button disabled">
      <i class="fa-solid fa-feather"></i>
    </a>
  </fieldset>

  <fieldset style="flex-basis: 100%">
    <legend> Button / Group </legend>

    <div>
      <span>
        Change the sheet size to see the options show/hide dynamically.
      </span>
    </div>

    <!-- svelte-ignore a11y-missing-attribute -->
    <div class="button-group">
      <a class="button">
        <span class="hide-before-850">Action</span>
        <span class="show-before-850">A</span>
      </a>
      <a class="button active">Bonus Action</a>
      <a class="button hide-before-1000">Reaction</a>
      <a class="button hide-before-950">Can Use</a>
      <a class="button hide-before-900">Magical</a>
    </div>
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
    container-type: inline-size;

    > * {
      flex: 1 0 auto;
    }

    legend {
      white-space: nowrap;
    }

    &.inverse {
      background: var(--t5e-component-card-onInverse-default);
    }
  }

  .vertical-gallery {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.25rem;
  }

  .wrapped-gallery {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .show-before-850 {
    display: none;
  }

  @container (width < 850px) {
    .show-before-850 {
      display: flex !important;
    }
  }
  @container (width < 850px) {
    .hide-before-850 {
      display: none !important;
    }
  }
  @container (width < 900px) {
    .hide-before-900 {
      display: none !important;
    }
  }
  @container (width < 950px) {
    .hide-before-950 {
      display: none !important;
    }
  }
  @container (width < 1000px) {
    .hide-before-1000 {
      display: none !important;
    }
  }
</style>
