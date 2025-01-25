<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { settings } from 'src/settings/settings.svelte';
  import { getThemeOrDefault } from 'src/theme/theme';
  import type { ItemDebugSheetQuadroneContext } from '../Tidy5eItemDebugSheetQuadrone.svelte';
  import ButtonWithOptionPanel from 'src/components/buttons/ButtonWithOptionPanel.svelte';
  import ToggleButton from 'src/components/buttons/ToggleButton.svelte';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import FieldToggle from 'src/components/toggles/FieldToggle.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import PillSwitch from 'src/components/toggles/PillSwitch.svelte';
  import Search from '../shared/Search.svelte';
  import { preventNewlines } from 'src/actions/prevent-newlines';
  import ItemDescriptions from '../shared/ItemDescriptions.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getSheetContext<ItemDebugSheetQuadroneContext>());

  let theme = $derived(getThemeOrDefault(settings.value.colorScheme));

  let inverse = $state(false);

  let selectedTabId: string = $state('hallo-tab');

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
          onclick={(ev) => selectTheme(CONSTANTS.THEME_ID_DEFAULT_LIGHT)}
        />
        {game.i18n.localize('TIDY5E.Settings.SheetTheme.light')}
      </label>
      <label for="dark-mode-toggle">
        <input
          id="dark-mode-toggle"
          type="radio"
          name="theme-selector"
          value={CONSTANTS.THEME_ID_DEFAULT_DARK}
          checked={theme.id === CONSTANTS.THEME_ID_DEFAULT_DARK}
          onclick={(ev) => selectTheme(CONSTANTS.THEME_ID_DEFAULT_DARK)}
        />
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
          onclick={() => (inverse = false)}
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
          onclick={() => (inverse = true)}
        />
        Inverse
      </label>
    </div>
  </div>
</aside>
<div class="item-content" class:inverse>
  <div class="controls-gallery">
    <div class="span-all">
      <!-- Name -->
      {#if context.unlocked}
        <TextInput
          field="name"
          document={context.item}
          value={context.item.name}
          class="document-name"
        />
      {:else}
        <div class="document-name">{context.item.name ?? ''}</div>
      {/if}
    </div>
    <div class="span-all">
      <Tabs
        tabs={context.tabs}
        bind:selectedTabId
        cssClass="item-tabs"
        sheet={context.item.sheet}
      />
    </div>
    <div class="span-all">
      <TabContents tabs={context.tabs} {selectedTabId} />
    </div>
    <div>
      <ItemDescriptions
        document={context.document}
        itemDescriptions={context.itemDescriptions}
      />
    </div>
    <fieldset class="vertical-gallery">
      <legend> Button / Attention </legend>
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
        <a class="button icon-button">
          <i class="fas fa-hand"></i>
        </a>
        <a class="button icon-button active">
          <i class="fas fa-hand"></i>
        </a>
        <a class="button icon-button disabled">
          <i class="fas fa-hand"></i>
        </a>
        <a class="button icon-button active disabled">
          <i class="fas fa-hand"></i>
        </a>
      </div>
      <div class="vertical-gallery">
        Buttons
        <button class="icon-button">
          <i class="fas fa-hand"></i>
        </button>
        <button class="icon-button active">
          <i class="fas fa-hand"></i>
        </button>
        <button class="icon-button disabled">
          <i class="fas fa-hand"></i>
        </button>
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
          {#snippet options()}
            <label>
              <input type="radio" name="icon-menu-test" value="1" /> Test Option
              1
            </label>
            <label>
              <input type="radio" name="icon-menu-test" value="2" /> Test Option
              2
            </label>
          {/snippet}
        </ButtonWithOptionPanel>
        <ButtonWithOptionPanel class="icon-button" active={true}>
          <i class="fas fa-hand"></i>
          {#snippet options()}
            O hai 🙋‍♀️
          {/snippet}
        </ButtonWithOptionPanel>
        <ButtonWithOptionPanel class="icon-button" disabled={true}>
          <i class="fas fa-hand"></i>
          {#snippet options()}
            O hai 🙋‍♀️
          {/snippet}
        </ButtonWithOptionPanel>
        <ButtonWithOptionPanel
          class="icon-button active"
          disabled={true}
          active={true}
        >
          <i class="fas fa-hand"></i>
          {#snippet options()}
            O hai 🙋‍♀️
          {/snippet}
        </ButtonWithOptionPanel>
      </div>
    </fieldset>
    <fieldset>
      <legend> Button / Edit Description </legend>
      <a class="button icon-button">
        <i class="fa-solid fa-feather"></i>
      </a>
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
        <li class="spell-component" data-tooltip="Verbal">V</li>
        <li class="spell-component" data-tooltip="Somatic">S</li>
        <li class="spell-component" data-tooltip="Material">M</li>
        <li class="spell-component-special" data-tooltip="Ritual">R</li>
        <li class="spell-component-special" data-tooltip="Concentration">C</li>
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
      <label for="checkbox-test-1" class="checkbox">
        <input type="checkbox" id="checkbox-test-1" /> Property
      </label>
      <label for="checkbox-test-2" class="checkbox">
        <input type="checkbox" id="checkbox-test-2" checked /> Property
      </label>
      <label for="checkbox-test-3" class="checkbox">
        <input type="checkbox" id="checkbox-test-3" disabled /> Property
      </label>
      <label for="checkbox-test-4" class="checkbox">
        <input type="checkbox" id="checkbox-test-4" checked disabled /> Property
      </label>
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
      <label class="radio" for="test-1">
        <input type="radio" name="test" id="test-1" checked={true} />
        <span class="radio-label">Property</span>
      </label>
      <label class="radio" for="test-2">
        <input type="radio" name="test" id="test-2" />
        <span class="radio-label">Property</span>
      </label>
      <label class="radio" for="test-3">
        <input type="radio" name="test" id="test-3" disabled />
        <span class="radio-label">Property <br />with line breaks</span>
      </label>
    </fieldset>
    <fieldset class="vertical-gallery">
      <legend> Input / Search </legend>
      <Search />
      <Search disabled={true} />
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
      <div class="input-group">
        <i class="fa-solid fa-cube"></i>
        <input type="text" value="Value" />
      </div>
      <div class="input-group">
        <i class="fa-solid fa-cube"></i>
        <input type="text" value="Value" disabled />
      </div>
    </fieldset>
    <fieldset class="vertical-gallery">
      <legend> Input / Text with Label </legend>
      <div class="input-group">
        <i class="currency gp" aria-label="gp"></i>
        <input type="text" value="Value" />
        <span> GP </span>
      </div>
      <div class="input-group">
        <i class="currency gp" aria-label="gp"></i>
        <input type="text" value="Value" disabled />
        <span> GP </span>
      </div>
      <div class="input-group right">
        <i class="currency gp" aria-label="gp"></i>
        <input type="text" value="Value" />
        <span> GP </span>
      </div>
      <div class="input-group right">
        <i class="currency gp" aria-label="gp"></i>
        <input type="text" value="Value" disabled />
        <span> GP </span>
      </div>
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
        checked={context.system.equipped}
        checkedIconClass="fas fa-hand-fist equip-icon fa-fw"
        uncheckedIconClass="far fa-hand fa-fw"
        onchange={(ev) =>
          context.item.update({
            'system.equipped': ev.currentTarget.checked,
          })}
      >
        Equipped
      </PillSwitch>
      SVG
      <PillSwitch
        checked={context.system.attuned}
        checkedSvgSrc="systems/dnd5e/icons/svg/statuses/concentrating.svg"
        uncheckedSvgSrc="systems/dnd5e/icons/svg/statuses/concentrating.svg"
        onchange={(ev) =>
          context.item.update({
            'system.attuned': ev.currentTarget.checked,
          })}
      >
        Attuned
      </PillSwitch>
    </fieldset>
    <fieldset style="max-width: 75rem;">
      <legend>Form Example</legend>
      <div class="form-group">
        <label>Spell Level</label>
        <div class="form-fields">
          <select>
            <option>Cantrip</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Spell School</label>
        <div class="form-fields">
          <select>
            <option>Abjuration</option>
          </select>
        </div>
      </div>
      <div class="form-group stacked checkbox-grid checkbox-grid-3">
        <label>Spell Components</label>
        <div class="form-fields">
          <label class="checkbox">
            <input type="checkbox" />
            <span>Property</span>
          </label>
          <label class="checkbox">
            <input type="checkbox" />
            <span>Property</span>
          </label>
          <label class="checkbox">
            <input type="checkbox" />
            <span>Property</span>
          </label>
          <label class="checkbox">
            <input type="checkbox" />
            <span>Property</span>
          </label>
          <label class="checkbox">
            <input type="checkbox" />
            <span>Property</span>
          </label>
          <label class="checkbox">
            <input type="checkbox" />
            <span>Property</span>
          </label>
          <label class="checkbox">
            <input type="checkbox" />
            <span>Property</span>
          </label>
          <label class="checkbox">
            <input type="checkbox" />
            <span>Property</span>
          </label>
          <label class="checkbox">
            <input type="checkbox" />
            <span>Property</span>
          </label>
          <label class="checkbox">
            <input type="checkbox" />
            <span>Property</span>
          </label>
          <label class="checkbox">
            <input type="checkbox" />
            <span>Property</span>
          </label>
          <label class="checkbox">
            <input type="checkbox" />
            <span>Property</span>
          </label>
          <label class="checkbox">
            <input type="checkbox" />
            <span>Property</span>
          </label>
        </div>
      </div>
      <div class="form-group split-group">
        <label>Spellcasting Materials</label>
        <div class="form-fields">
          <div class="form-group label-top">
            <label>Supply</label>
            <div class="form-fields">
              <input
                type="number"
                value="0"
                min="0"
                step="any"
                placeholder="0"
              />
            </div>
          </div>
          <div class="form-group label-top">
            <label class="label-icon currency gp" aria-label="Cost (GP)">
              Cost
            </label>
            <div class="form-fields">
              <input
                type="number"
                value="0"
                min="0"
                step="any"
                placeholder="—"
              />
            </div>
          </div>
          <div class="form-group checkbox">
            <div class="form-fields">
              <input type="checkbox" />
            </div>
            <label>Consumed</label>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label role="presentation"></label>
        <div class="form-fields">
          <textarea
            rows="2"
            value="A tiny ball of bat guano and sulfur"
            class="full-width"
            aria-multiline="false"
            use:preventNewlines
          ></textarea>
        </div>
      </div>
      <div class="form-group">
        <label>Spell Preparation Mode</label>
        <div class="form-fields">
          <input type="checkbox" />
          <select>
            <option></option>
          </select>
        </div>
      </div>
      <div class="form-group split-group">
        <label>Casting Time</label>
        <div class="form-fields">
          <div class="form-group label-top">
            <label>Cost</label>
            <div class="form-fields">
              <select name="system.activation.type"
                ><optgroup label="Standard"
                  ><option value="action">Action</option><option value="bonus"
                    >Bonus Action</option
                  ><option value="reaction">Reaction</option></optgroup
                ><optgroup label="Time"
                  ><option value="minute">Minutes</option><option value="hour"
                    >Hours</option
                  ><option value="day">Days</option></optgroup
                ><optgroup label="Monster"
                  ><option value="legendary">Legendary Action</option><option
                    value="mythic">Mythic Action</option
                  ><option value="lair">Lair Action</option></optgroup
                ><optgroup label="Vehicle"
                  ><option value="crew">Crew Action</option></optgroup
                ><option value="special">Special</option><option value=""
                  >None</option
                ></select
              >
            </div>
          </div>
        </div>
        <input
          type="text"
          name="system.activation.condition"
          value=""
          placeholder="Activation Condition"
          class="full-width"
        />
      </div>
      <div class="form-group split-group">
        <label>Range</label>
        <div class="form-fields">
          <div class="form-group label-top">
            <label>Value</label>
            <div class="form-fields">
              <input type="text" name="system.range.value" value="150" />
            </div>
          </div>
          <div class="form-group label-top">
            <label>Units</label>
            <div class="form-fields">
              <select name="system.range.units"
                ><option value="self">Self</option><option value="touch"
                  >Touch</option
                ><option value="spec">Special</option><option value="any"
                  >Any</option
                ><optgroup label="Distance"
                  ><option value="ft">Feet</option><option value="mi"
                    >Miles</option
                  ><option value="m">Meters</option><option value="km"
                    >Kilometers</option
                  ></optgroup
                ></select
              >
            </div>
          </div>
        </div>
        <input
          type="text"
          name="system.range.special"
          value=""
          placeholder="Special Range"
          class="full-width"
        />
      </div>
      <div class="form-group split-group">
        <label>Duration</label>
        <div class="form-fields">
          <div class="form-group label-top">
            <label>Time</label>
            <div class="form-fields">
              <select>
                <option value="inst">Instantaneous</option>
                <option value="spec">Special</option>
                <optgroup label="Time">
                  <option value="turn">Turns</option>
                  <option value="round">Rounds </option>
                  <option value="minute">Minutes</option>
                  <option value="hour">Hours</option>
                  <option value="day">Days</option>
                  <option value="month">Months</option>
                  <option value="year">Years</option>
                </optgroup>
                <optgroup label="Permanent">
                  <option value="disp">Until Dispelled</option>
                  <option value="dstr">Until Dispelled or Triggered</option>
                  <option value="perm">Permanent</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group split-group">
        <label>Type</label>
        <div class="form-fields">
          <div class="form-group label-top">
            <label>Amount</label>
            <div class="form-fields">
              <input type="text" value="" placeholder="Every" />
            </div>
          </div>
          <div class="form-group label-top">
            <label>Type</label>
            <div class="form-fields">
              <select>
                <option value=""></option>
                <option value="self">Self</option>
                <option value="ally">Ally</option>
                <option value="enemy">Enemy</option>
                <option value="creature">Creature</option>
                <option value="object">Object</option>
                <option value="space">Space</option>
                <option value="creatureOrObject">Creature or Object</option>
                <option value="any">Any</option>
                <option value="willing">Willing Creature</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Choose Targets</label>
        <div class="form-fields">
          <span style="display: flex; align-items: center;">
            <input type="checkbox" />
          </span>
        </div>
        <div class="form-group" style="flex-basis: 100%">
          <label role="presentation"></label>
          <p class="hint" style="flex-basis: auto; flex: 3;">
            When targeting an area, can the user choose who it affects?
          </p>
        </div>
      </div>
      <div class="form-group">
        <label>Shape</label>
        <div class="form-fields">
          <select>
            <option value=""></option>
            <option value="cone">Cone</option>
            <option value="cube">Cube</option>
            <option value="cylinder">Cylinder</option>
            <option value="radius">Emanation</option>
            <option value="line">Line</option>
            <option value="sphere">Sphere</option>
            <hr />
            <option value="circle">Circle</option>
            <option value="square">Square</option>
            <option value="wall">Wall</option>
          </select>
        </div>
      </div>
      <div class="form-group split-group">
        <label>Dimensions</label>
        <div class="form-fields">
          <div class="form-group label-top">
            <label>Radius</label>
            <div class="form-fields">
              <input type="text" value="20" />
            </div>
          </div>
          <div class="form-group label-top">
            <label>Units</label>
            <div class="form-fields">
              <select>
                <option value=""> </option>
                <option value="ft">Feet</option>
                <option value="mi">Miles</option>
                <option value="m">Meters</option>
                <option value="km">Kilometers</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group split-group">
        <label>Multiple</label>
        <div class="form-fields">
          <div class="form-group label-top">
            <label>Amount</label>
            <div class="form-fields">
              <input type="text" value="" placeholder="1" />
            </div>
          </div>
        </div>
      </div>
      <div class="form-group split-group">
        <label>Limited Uses</label>
        <div class="form-fields">
          <div class="form-group label-top">
            <label>Spent</label>
            <div class="form-fields">
              <input type="number" value="0" min="0" step="1" />
            </div>
          </div>
          <div class="form-group label-top">
            <label>Max</label>
            <div class="form-fields">
              <input type="text" value="" />
            </div>
          </div>
        </div>
      </div>
      <div class="form-group custom-section">
        <label for="i-o8WdxHamTy4ZvN3n-tidy-5e-custom-section"> Section </label>
        <div class="form-fields">
          <input
            type="text"
            id="i-o8WdxHamTy4ZvN3n-tidy-5e-custom-section"
            value=""
          />
        </div>
      </div>
      <div class="form-group custom-action-section">
        <label for="i-o8WdxHamTy4ZvN3n-tidy-5e-custom-action-section">
          Action Section
        </label>
        <div class="form-fields">
          <input
            type="text"
            id="i-o8WdxHamTy4ZvN3n-tidy-5e-custom-action-section"
            value=""
          />
        </div>
      </div>
    </fieldset>
  </div>
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
      background: var(--t5e-component-card-oninverse-default);
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
