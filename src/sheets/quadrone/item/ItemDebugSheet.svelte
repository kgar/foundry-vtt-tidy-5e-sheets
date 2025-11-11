<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ItemDebugSheetQuadroneContext } from '../Tidy5eItemDebugSheetQuadrone.svelte';
  import ButtonWithOptionPanel from 'src/components/buttons/ButtonWithOptionPanel.svelte';
  import ToggleButton from 'src/components/buttons/ToggleButton.svelte';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import FieldToggle from 'src/components/toggles/FieldToggle.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import PillSwitch from 'src/components/toggles/PillSwitch.svelte';
  import Search from '../shared/Search.svelte';
  import { preventNewlines } from 'src/actions/prevent-newlines';
  import ItemDescriptions from '../shared/ItemDescriptions.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import ItemName from './parts/header/ItemName.svelte';

  let context = $derived(getSheetContext<ItemDebugSheetQuadroneContext>());

  let inverse = $state(false);

  let selectedTabId: string = $state('hallo-tab');

  function selectTheme(themeId: string) {
    game.settings.set(CONSTANTS.MODULE_ID, 'colorScheme', themeId);
  }
</script>

<aside class="sidebar theme-dark">
  <div class="sidebar-contents">
    To Do: Put useful controls over here for testing sheet things.
  </div>
</aside>
<div class="item-content">
  <div class="controls-gallery">
    <div class="span-all">
      <ItemName />
    </div>
    <div class="span-all">
      <Tabs
        tabs={context.tabs}
        bind:selectedTabId
        cssClass="item-tabs"
        sheet={context.sheet}
        tabContext={{ context, item: context.item }}
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
      <legend>
        Spellcasting Table
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
      <div class="tidy-table-container spellcasting" style="min-width: 720px;">
        <div class="tidy-table">
          <div class="tidy-table-header-row dark innate">
            <div class="button expand-button">
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="header-label-cell tidy-table-header-cell primary">
              <h3>Innate</h3>
              <span class="table-header-count">3</span>
            </div>

            <!-- TODO: Redo these tables with the updated classes after implementing the tidy tables -->
            <div class="tidy-table-header-cell">
              <div class="cell-name">Components</div>
            </div>
            <div class="tidy-table-header-cell">
              <div class="cell-name">Time</div>
            </div>
            <div class="tidy-table-header-cell">
              <div class="cell-name">Uses</div>
            </div>
            <div class="tidy-table-header-cell">
              <div class="cell-name">Range</div>
            </div>
            <div class="tidy-table-header-cell">
              <div class="cell-name">Hit</div>
            </div>
            <div class="tidy-table-header-cell header-cell-actions">
              <div class="tidy-table-button add-item">
                <i class="fas fa-plus"></i>
              </div>
            </div>
          </div>
          <div class="tidy-table-row spell">
            <div class="tidy-table-button tidy-table-row-use-button">
              <img
                class="item-image"
                alt="Spell Name"
                src="icons/magic/fire/projectile-fireball-smoke-orange.webp"
              />
              <i class="fas fa-dice-d20"></i>
            </div>
            <div class="tidy-table-cell item-label text-cell primary">
              <div class="cell-name">Fire Bolt</div>
              <div class="cell-context">V, S, M</div>
            </div>
            <div class="tidy-table-cell spell-components">
              <ul class="unlist spell-components">
                <li class="spell-component" data-tooltip="Verbal">V</li>
                <li class="spell-component" data-tooltip="Somatic">S</li>
              </ul>
            </div>
            <div class="tidy-table-cell text-cell">
              <div class="item-name" data-tooltip="Action">A</div>
            </div>
            <div class="tidy-table-cell">
              <div class="uses">
                <span class="value">1</span>
                <span class="divider">/</span>
                <span class="max">10</span>
              </div>
            </div>
          </div>
          <div class="tidy-table-row spell rarity rare">
            <div class="tidy-table-button tidy-table-row-use-button">
              <img
                class="item-image"
                alt="Spell Name"
                src="icons/magic/fire/projectile-fireball-smoke-orange.webp"
              />
              <i class="fas fa-dice-d20"></i>
            </div>
            <div class="tidy-table-cell item-label text-cell primary">
              <div class="cell-name">Fire Bolt</div>
              <div class="cell-context">Rare</div>
            </div>
            <div class="tidy-table-cell spell-components">
              <ul class="unlist spell-components">
                <li class="spell-component" data-tooltip="Somatic">S</li>
                <li class="spell-component" data-tooltip="Material">M</li>
                <li
                  class="spell-component-special"
                  data-tooltip="Concentration"
                >
                  C
                </li>
              </ul>
            </div>
            <div class="tidy-table-cell text-cell">
              <div class="item-name" data-tooltip="Action">A</div>
            </div>
            <div class="tidy-table-cell">
              <div class="uses">
                <span class="value">1</span>
                <span class="divider">/</span>
                <span class="max">10</span>
              </div>
            </div>
          </div>
          <div class="tidy-table-row spell equipped">
            <div class="tidy-table-button tidy-table-row-use-button">
              <img
                class="item-image"
                alt="Spell Name"
                src="icons/magic/fire/projectile-fireball-smoke-orange.webp"
              />
              <i class="fas fa-dice-d20"></i>
            </div>
            <div class="tidy-table-cell item-label text-cell primary">
              <div class="cell-name">Fire Bolt</div>
              <div class="cell-context">Prepared</div>
            </div>
            <div class="tidy-table-cell spell-components">
              <ul class="unlist spell-components">
                <li class="spell-component" data-tooltip="Verbal">V</li>
                <li class="spell-component" data-tooltip="Somatic">S</li>
              </ul>
            </div>
            <div class="tidy-table-cell text-cell">
              <div class="item-name" data-tooltip="Action">A</div>
            </div>
            <div class="tidy-table-cell">
              <div class="uses">
                <span class="value">1</span>
                <span class="divider">/</span>
                <span class="max">10</span>
              </div>
            </div>
          </div>
          <div class="tidy-table-row spell equipped">
            <div class="tidy-table-button tidy-table-row-use-button">
              <img
                class="item-image"
                alt="Spell Name"
                src="icons/magic/fire/projectile-fireball-smoke-orange.webp"
              />
              <i class="fas fa-dice-d20"></i>
            </div>
            <div class="tidy-table-cell item-label text-cell primary">
              <div class="item-name">Fire Bolt</div>
            </div>
            <div class="tidy-table-cell spell-components">
              <ul class="unlist spell-components">
                <li class="spell-component" data-tooltip="Verbal">V</li>
                <li class="spell-component" data-tooltip="Somatic">S</li>
                <li class="spell-component" data-tooltip="Material">M</li>
                <li class="spell-component-special" data-tooltip="Ritual">R</li>
              </ul>
            </div>
            <div class="tidy-table-cell text-cell">
              <div class="item-name" data-tooltip="Action">A</div>
            </div>
            <div class="tidy-table-cell">
              <div class="uses">
                <i class="fas fa-bolt"></i>
              </div>
            </div>
            <div class="tidy-table-cell text-cell">
              <div class="cell-name">120 ft.</div>
              <div class="cell-context">1 creature</div>
            </div>
            <div class="tidy-table-cell text-cell">
              <div class="hit-save">
                <span class="ability">WIS</span>
                <span class="value">15</span>
              </div>
            </div>
          </div>

          <div class="tidy-table-row spell equipped">
            <div class="tidy-table-button tidy-table-row-use-button">
              <img
                class="item-image"
                alt="Spell Name"
                src="icons/magic/fire/projectile-fireball-smoke-orange.webp"
              />
              <i class="fas fa-dice-d20"></i>
            </div>
            <div class="tidy-table-cell item-label text-cell primary">
              <div class="cell-name">Lightning Breath</div>
            </div>
            <div class="tidy-table-cell spell-components">
              <ul class="unlist spell-components">
                <li class="spell-component" data-tooltip="Verbal">V</li>
                <li class="spell-component" data-tooltip="Somatic">S</li>
                <li class="spell-component" data-tooltip="Material">M</li>
                <li class="spell-component-special" data-tooltip="Ritual">R</li>
              </ul>
            </div>
            <div class="tidy-table-cell text-cell">
              <div class="cell-name">A</div>
            </div>
            <div class="tidy-table-cell">
              <div class="uses recharge">
                <i class="fas fa-dice-five"></i>
                <span class="value">5</span>
                <span class="modifier">+</span>
              </div>
            </div>
            <div class="tidy-table-cell text-cell">
              <div class="cell-name">30 ft.</div>
              <div class="cell-context">Cone</div>
            </div>
            <div class="tidy-table-cell text-cell">
              <div class="hit-save">
                <span class="modifier">+</span>
                <span class="value">8</span>
              </div>
            </div>
          </div>
        </div>
        <div class="tidy-table">
          <div class="tidy-table-header-row dark">
            <div class="button expand-button">
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="header-label-cell tidy-table-header-cell primary">
              <h3>Items</h3>
              <span class="table-header-count">3</span>
            </div>

            <div class="tidy-table-header-cell">
              <div class="cell-name">Time</div>
            </div>
            <div class="tidy-table-header-cell">
              <div class="cell-name">Uses</div>
            </div>
            <div class="tidy-table-header-cell">
              <div class="cell-name">Range</div>
            </div>
            <div class="tidy-table-header-cell">
              <div class="cell-name">Hit</div>
            </div>
            <div
              class="tidy-table-header-cell"
              style="width: calc(1.5rem * 4 + 0.125rem);"
            >
              <div class="cell-name">Actions</div>
            </div>
          </div>
          <div class="tidy-table-row spell rarity rare">
            <div class="tidy-table-button tidy-table-row-use-button">
              <img
                class="item-image"
                alt="Spell Name"
                src="icons/magic/fire/projectile-fireball-smoke-orange.webp"
              />
              <i class="fas fa-dice-d20"></i>
            </div>
            <div class="tidy-table-cell item-label text-cell primary">
              <div class="cell-name">Fire Bolt</div>
              <div class="cell-context">Rare</div>
            </div>
            <div class="tidy-table-cell spell-components">
              <ul class="unlist spell-components">
                <li class="spell-component" data-tooltip="Somatic">S</li>
                <li class="spell-component" data-tooltip="Material">M</li>
                <li
                  class="spell-component-special"
                  data-tooltip="Concentration"
                >
                  C
                </li>
              </ul>
            </div>
            <div class="tidy-table-cell text-cell">
              <div class="item-name" data-tooltip="Action">A</div>
            </div>
            <div class="tidy-table-cell">
              <div class="uses">
                <span class="value">1</span>
                <span class="divider">/</span>
                <span class="max">10</span>
              </div>
            </div>
            <div class="tidy-table-cell tidy-table-actions">
              <div class="tidy-table-button">
                <i class="fas fa-hand"></i>
              </div>
              <div class="tidy-table-button button-toggle toggled">
                <i class="far fa-regular fa-sun"></i>
              </div>
              <div class="tidy-table-button">
                <i class="fas fa-bookmark"></i>
              </div>
              <div class="tidy-table-button">
                <i class="fas fa-ellipsis-vertical"></i>
              </div>
            </div>
          </div>
          <div class="tidy-table-row spell equipped">
            <div class="tidy-table-button tidy-table-row-use-button">
              <img
                class="item-image"
                alt="Spell Name"
                src="icons/magic/fire/projectile-fireball-smoke-orange.webp"
              />
              <i class="fas fa-dice-d20"></i>
            </div>
            <div class="tidy-table-cell item-label text-cell primary">
              <div class="cell-name">Fire Bolt</div>
              <div class="cell-context">Prepared</div>
            </div>
            <div class="tidy-table-cell spell-components">
              <ul class="unlist spell-components">
                <li class="spell-component" data-tooltip="Verbal">V</li>
                <li class="spell-component" data-tooltip="Somatic">S</li>
              </ul>
            </div>
            <div class="tidy-table-cell text-cell">
              <div class="item-name" data-tooltip="Action">A</div>
            </div>
            <div class="tidy-table-cell">
              <div class="uses">
                <span class="value">1</span>
                <span class="divider">/</span>
                <span class="max">10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </fieldset>
    <fieldset disabled={!context.unlocked}>
      <legend>
        Colors
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
      <div
        style="background-color: var(--t5e-color-palette-red-45); padding: 0.5rem; color:white;"
      >
        Brand red
      </div>
      <div
        style="background-color: var(--t5e-theme-color-default); padding: 0.5rem; color:white;"
      >
        Default theme color
      </div>
      <div
        style="background-color: var(--t5e-theme-color-darkest); padding: 0.5rem; color:white;"
      >
        Darkest theme color
      </div>
      <div
        style="background-color: var(--t5e-theme-color-darker); padding: 0.5rem; color:white;"
      >
        Darker theme color
      </div>
      <div
        style="background-color: var(--t5e-theme-color-lighter); padding: 0.5rem; color:white;"
      >
        Lighter theme color
      </div>
      <div
        style="background-color: var(--t5e-theme-color-lightest); padding: 0.5rem; color:white;"
      >
        Lightest theme color
      </div>
      <div
        style="background-color: var(--t5e-theme-color-highlight); padding: 0.5rem; color:white;"
      >
        Highlight theme color
      </div>
      <div
        style="background: linear-gradient(90deg, var(--t5e-theme-color-darkest), var(--t5e-theme-color-default)); padding: 0.5rem; color:white;"
      >
        Theme gradient
      </div>
      <!-- TODO -->
    </fieldset>
    <fieldset class="vertical-gallery">
      <legend>
        Button / Primary
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
      Anchor
      <a class="button active">
        <i class="fas fa-edit"></i>
        Edit Details
      </a>
      Button
      <button type="button" class="active">
        <i class="fas fa-edit"></i>
        Edit Details
      </button>
    </fieldset>
    <fieldset class="vertical-gallery">
      <legend>
        Button / Default
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
      Anchor
      <a class="button">
        <i class="fas fa-edit"></i>
        Edit Details
      </a>
      Button
      <button type="button">
        <i class="fas fa-edit"></i>
        Edit Details
      </button>
    </fieldset>
    <fieldset style="display: flex; gap: 0.5rem;">
      <legend>
        Button / Icon Only
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
      <div class="vertical-gallery">
        Anchors
        <a class="button button-icon-only">
          <i class="fas fa-hand"></i>
        </a>
        <a class="button button-icon-only active">
          <i class="fas fa-hand"></i>
        </a>
        <a class="button button-icon-only disabled">
          <i class="fas fa-hand"></i>
        </a>
        <a class="button button-icon-only active disabled">
          <i class="fas fa-hand"></i>
        </a>
      </div>
      <div class="vertical-gallery">
        Buttons
        <button type="button" class="button-icon-only">
          <i class="fas fa-hand"></i>
        </button>
        <button type="button" class="button-icon-only active">
          <i class="fas fa-hand"></i>
        </button>
        <button type="button" class="button-icon-only disabled">
          <i class="fas fa-hand"></i>
        </button>
        <button type="button" class="button-icon-only active disabled">
          <i class="fas fa-hand"></i>
        </button>
      </div>
    </fieldset>
    <fieldset disabled={!context.unlocked}>
      <legend>
        Button / Icon Only Menu
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
      <div class="wrapped-gallery">
        <ButtonWithOptionPanel buttonClasses="button-icon-only">
          <i class="fas fa-hand"></i>
          {#snippet menu()}
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
        <ButtonWithOptionPanel buttonClasses="button-icon-only" active={true}>
          <i class="fas fa-hand"></i>
          {#snippet menu()}
            O hai 🙋‍♀️
          {/snippet}
        </ButtonWithOptionPanel>
        <ButtonWithOptionPanel buttonClasses="button-icon-only" disabled={true}>
          <i class="fas fa-hand"></i>
          {#snippet menu()}
            O hai 🙋‍♀️
          {/snippet}
        </ButtonWithOptionPanel>
        <ButtonWithOptionPanel
          buttonClasses="button-icon-only active"
          disabled={true}
          active={true}
        >
          <i class="fas fa-hand"></i>
          {#snippet menu()}
            O hai 🙋‍♀️
          {/snippet}
        </ButtonWithOptionPanel>
      </div>
    </fieldset>
    <fieldset disabled={!context.unlocked}>
      <legend>
        Button / Edit Description
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
      <a class="button button-icon-only">
        <i class="fa-solid fa-feather"></i>
      </a>
      <a class="button button-icon-only disabled">
        <i class="fa-solid fa-feather"></i>
      </a>
    </fieldset>
    <fieldset class="span-all">
      <legend>
        Button / Group
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
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
      <legend>
        Button / Toggle
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
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
    <fieldset disabled={!context.unlocked}>
      <legend>
        Category / Spell context icon
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
      <!-- TODO -->
    </fieldset>
    <fieldset disabled={!context.unlocked}>
      <legend>
        Data / Spell Components
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
      <ul class="unlist spell-components">
        <li class="spell-component" data-tooltip="Verbal">V</li>
        <li class="spell-component" data-tooltip="Somatic">S</li>
        <li class="spell-component" data-tooltip="Material">M</li>
        <li class="spell-component-special" data-tooltip="Ritual">R</li>
        <li class="spell-component-special" data-tooltip="Concentration">C</li>
      </ul>
    </fieldset>
    <fieldset disabled={!context.unlocked}>
      <legend>
        Data / Time
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
      <div class="time">
        <div class="title">Action</div>
        <div class="subtitle">Ritual</div>
      </div>
    </fieldset>
    <fieldset disabled={!context.unlocked}>
      <legend>
        Data / Uses
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
      <!-- TODO -->
    </fieldset>
    <fieldset disabled={!context.unlocked}>
      <legend>
        Enricher
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
      <!-- TODO -->
    </fieldset>
    <fieldset disabled={!context.unlocked}>
      <legend>
        Field
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
      <!-- TODO -->
    </fieldset>
    <fieldset disabled={!context.unlocked}>
      <legend>
        Filigree box
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
      <!-- TODO -->
    </fieldset>
    <fieldset disabled={!context.unlocked}>
      <legend>
        Input / Checkbox
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
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
      <legend
        >Input / Radio
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
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
      <legend>
        Input / Search
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
      <Search />
      <Search disabled={true} />
    </fieldset>
    <fieldset class="vertical-gallery">
      <legend>
        Input / Select
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
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
    <fieldset disabled={!context.unlocked}>
      <legend
        >Input / Switch - Field Toggle
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
      <!-- TODO -->
      <FieldToggle></FieldToggle>
      <FieldToggle checked={true}></FieldToggle>
    </fieldset>
    <fieldset class="vertical-gallery">
      <legend>
        Input / Text
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
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
      <legend>
        Input / Text with Icon
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
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
      <legend>
        Input / Text with Label
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
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
    <fieldset disabled={!context.unlocked}>
      <legend>
        Pill
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
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
    <fieldset disabled={!context.unlocked}>
      <legend>
        Pill / Readonly
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
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
    <fieldset disabled={!context.unlocked}>
      <legend>
        Pill / Switch
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
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
      <legend
        >Form Example
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
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
      <div class="form-group stacked checkbox-grid">
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
              <label for="consumed" class="checkbox"
                ><input type="checkbox" id="consumed" /><span>Consumed</span
                ></label
              >
            </div>
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

<style lang="less">
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

    &.theme-dark {
      background: var(--t5e-component-card-default);
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
    gap: var(--t5e-size-1x);
  }

  .wrapped-gallery {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: var(--t5e-size-1x);
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
