<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { SettingsProvider } from 'src/settings/settings';
  import { getThemeOrDefault } from 'src/theme/theme';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemDebugSheetHightouchContext } from '../Tidy5eItemDebugSheetHightouch';
  import ButtonWithOptionPanel from 'src/components/buttons/ButtonWithOptionPanel.svelte';
  import ToggleButton from 'src/components/buttons/ToggleButton.svelte';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import FieldToggle from 'src/components/toggle/FieldToggle.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import PillSwitch from 'src/components/toggle/PillSwitch.svelte';
  import Search from '../shared/Search.svelte';

  let context = getContext<Readable<ItemDebugSheetHightouchContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: theme = getThemeOrDefault(SettingsProvider.settings.colorScheme.get());

  let inverse = false;

  let selectedTabId: string = 'hallo-tab';

  function selectTheme(themeId: string) {
    game.settings.set(CONSTANTS.MODULE_ID, 'colorScheme', themeId);
  }
</script>

<aside class="sidebar inverse">
  <div class="sidebar-contents">
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
  </div>
</aside>
<div class="item-content controls-gallery" class:inverse>
  <div class="span-all">
    <!-- Name -->
    {#if $context.unlocked}
      <TextInput
        field="name"
        document={$context.item}
        value={$context.item.name}
        class="document-name"
      />
    {:else}
      <div class="document-name">{$context.item.name ?? ''}</div>
    {/if}
  </div>
  <div class="span-all">
    <Tabs tabs={$context.tabs} bind:selectedTabId cssClass="item-tabs" />
  </div>
  <div class="span-all">
    <TabContents tabs={$context.tabs} bind:selectedTabId />
  </div>
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

  <fieldset class="span-all">
    <legend> Button / Group </legend>

    <div>
      <span>
        Change the sheet size to see the options show/hide dynamically.
      </span>
    </div>

    <!-- svelte-ignore a11y-missing-attribute -->
    <div class="button-group">
      <ToggleButton>
        <span class="hide-before-850">Action</span>
        <span class="show-before-850">A</span>
      </ToggleButton>
      <ToggleButton checked={true}>Bonus Action</ToggleButton>
      <ToggleButton class="hide-before-1000">Reaction</ToggleButton>
      <ToggleButton class="hide-before-950">Can Use</ToggleButton>
      <ToggleButton class="hide-before-900">Magical</ToggleButton>
    </div>
  </fieldset>

  <fieldset class="wrapped-gallery">
    <legend> Button / Toggle </legend>

    <div class="vertical-gallery">
      <ToggleButton checked={false}>Tidy</ToggleButton>
      <ToggleButton checked={true}>Tidy</ToggleButton>
      <ToggleButton checked={false} disabled={true}>Tidy</ToggleButton>
      <ToggleButton checked={true} disabled={true}>Tidy</ToggleButton>
    </div>
    <div class="vertical-gallery">
      <ToggleButton checked={false}>
        <i class="fas fa-broom"></i> Tidy
      </ToggleButton>
      <ToggleButton checked={true}>
        <i class="fas fa-broom"></i> Tidy
      </ToggleButton>
      <ToggleButton checked={false} disabled={true}>
        <i class="fas fa-broom"></i> Tidy
      </ToggleButton>
      <ToggleButton checked={true} disabled={true}>
        <i class="fas fa-broom"></i> Tidy
      </ToggleButton>
    </div>
    <div class="vertical-gallery">
      <ToggleButton checked={false}>
        <Dnd5eIcon src="systems/dnd5e/icons/svg/statuses/concentrating.svg" />
        Tidy
      </ToggleButton>
      <ToggleButton checked={true}>
        <Dnd5eIcon src="systems/dnd5e/icons/svg/statuses/concentrating.svg" />
        Tidy
      </ToggleButton>
      <ToggleButton checked={false} disabled={true}>
        <Dnd5eIcon src="systems/dnd5e/icons/svg/statuses/concentrating.svg" />
        Tidy
      </ToggleButton>
      <ToggleButton checked={true} disabled={true}>
        <Dnd5eIcon src="systems/dnd5e/icons/svg/statuses/concentrating.svg" />
        Tidy
      </ToggleButton>
    </div>
  </fieldset>

  <fieldset>
    <legend> Category / Spell context icon </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Data / Spell Components </legend>

    <ul class="unlist spell-components">
      <li class="spell-component">V</li>
      <li class="spell-component">S</li>
      <li class="spell-component">M</li>
      <li class="spell-component-special">R</li>
      <li class="spell-component-special">C</li>
    </ul>
  </fieldset>

  <fieldset>
    <legend> Data / Time </legend>

    <div class="time">
      <div class="title">Action</div>
      <div class="subtitle">Ritual</div>
    </div>
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

    <label for="checkbox-test-1" class="checkbox"
      ><input type="checkbox" /> Property</label
    >
    <label for="checkbox-test-2" class="checkbox"
      ><input type="checkbox" checked /> Property</label
    >
    <label for="checkbox-test-3" class="checkbox"
      ><input type="checkbox" disabled /> Property</label
    >
    <label for="checkbox-test-4" class="checkbox"
      ><input type="checkbox" checked disabled /> Property</label
    >
  </fieldset>

  <fieldset class="vertical-gallery">
    <legend>Input / Radio</legend>

    <!-- 
      Radio button checkmarks aren't quite centering. Let's try to fix that:
      - https://codepen.io/isaacabrahamson/pen/qVXOWW?editors=1100
      - https://forum.freecodecamp.org/t/css-center-radio-buttons/158932/3
      - https://github.com/carbon-design-system/carbon/pull/6097/files
      - Working version, though using divs and not a radio button: https://js.devexpress.com/Angular/Demos/WidgetsGallery/Demo/RadioGroup/Overview/MaterialBlueDark/
      - https://github.com/shadcn-ui/ui/pull/2758 - another example of top/left at 50% and translate X/Y at -50%
      
    -->

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
        <label for="test-3">Property <br />with line breaks</label>
      </li>
    </ul>
  </fieldset>

  <fieldset>
    <legend> Input / Search </legend>

    <Search />
  </fieldset>

  <fieldset class="vertical-gallery">
    <legend> Input / Select </legend>

    <select>
      <option value=""></option>
      <option value="1">Attunement Required</option>
      <option value="2">Attunement Optional</option>
      <option value="3">No Attunement Required</option>
      <option value="4">Absolutely Cursed 💀</option>
    </select>
    <select>
      <option value=""></option>
      <option value="1" selected>Attunement Required</option>
      <option value="2">Attunement Optional</option>
      <option value="3">No Attunement Required</option>
      <option value="4">Absolutely Cursed 💀</option>
    </select>
    <select disabled>
      <option value=""></option>
      <option value="1">Attunement Required</option>
      <option value="2">Attunement Optional</option>
      <option value="3">No Attunement Required</option>
      <option value="4">Absolutely Cursed 💀</option>
    </select>
    <select disabled>
      <option value=""></option>
      <option value="1" selected>Attunement Required</option>
      <option value="2">Attunement Optional</option>
      <option value="3">No Attunement Required</option>
      <option value="4">Absolutely Cursed 💀</option>
    </select>
  </fieldset>

  <fieldset>
    <legend>Input / Switch - Field Toggle</legend>

    <!-- TODO -->
    <FieldToggle></FieldToggle>
    <FieldToggle checked={true}></FieldToggle>
  </fieldset>

  <fieldset class="vertical-gallery">
    <legend> Input / Text </legend>

    <input
      type="text"
      value="Value"
      placeholder="Aha! You found me! The hidden placeholder!"
    />
    <input type="text" placeholder="A placeholder here" />
    <input
      type="text"
      value="Value"
      placeholder="Aha! You found me! The hidden placeholder!"
      disabled
    />
    <input type="text" placeholder="A placeholder here" disabled />
  </fieldset>

  <fieldset class="vertical-gallery">
    <legend> Input / Text with Icon </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset class="vertical-gallery">
    <legend> Input / Text with Label </legend>

    <!-- TODO -->
  </fieldset>

  <fieldset>
    <legend> Pill </legend>

    <ul class="pills unlist">
      <li class="pill">Label</li>
      <li class="pill negative">
        Label <span><span class="lighter">-</span>1</span>
      </li>
      <li class="pill positive">
        Label <span><span class="lighter">+</span>1</span>
      </li>
    </ul>
  </fieldset>

  <fieldset>
    <legend> Pill / Readonly </legend>

    <ul class="pills">
      <li class="pill">
        Panache <span><span class="lighter">+</span>10</span>
      </li>
      <li class="pill"><i class="fas fa-broom"></i> Tidy 5e</li>
      <li class="pill">
        <Dnd5eIcon src="systems/dnd5e/icons/svg/statuses/concentrating.svg"
        ></Dnd5eIcon> Big Concentrate
      </li>
    </ul>
  </fieldset>

  <fieldset>
    <legend> Pill / Switch </legend>

    Fontawesome
    <PillSwitch
      checked={$context.system.equipped}
      checkedIconClass="fas fa-hand-fist equip-icon fa-fw"
      uncheckedIconClass="far fa-hand fa-fw"
      on:change={(ev) =>
        console.log(
          $context.item.update({ 'system.equipped': ev.currentTarget.checked }),
        )}
    >
      Equipped
    </PillSwitch>

    SVG
    <PillSwitch
      checked={$context.system.attuned}
      checkedSvgSrc="systems/dnd5e/icons/svg/statuses/concentrating.svg"
      uncheckedSvgSrc="systems/dnd5e/icons/svg/statuses/concentrating.svg"
      on:change={(ev) =>
        console.log(
          $context.item.update({ 'system.attuned': ev.currentTarget.checked }),
        )}
    >
      Attuned
    </PillSwitch>
  </fieldset>
</div>

<style lang="scss">
  .sidebar-contents {
    position: sticky;
    top: var(--header-height);
  }

  .controls-gallery {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;
    container-type: inline-size;
    padding-bottom: 1rem;

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

  .span-all {
    flex-basis: 100%;
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
