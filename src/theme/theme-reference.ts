import { CONSTANTS } from 'src/constants';
import { defaultDarkTheme } from './default-dark-theme';
import { defaultLightTheme } from './default-light-theme';

export function getCoreThemes(includeDefault: boolean) {
  let themes: Record<string, string> = {};

  if (includeDefault) {
    themes[CONSTANTS.THEME_ID_DEFAULT] = 'T5EK.Settings.SheetTheme.default';
  }

  themes[CONSTANTS.THEME_ID_DEFAULT_LIGHT] = defaultLightTheme.name;
  themes[CONSTANTS.THEME_ID_DEFAULT_DARK] = defaultDarkTheme.name;

  return themes;
}

export const themeVariables = {
  '--t5ek-title-font-family': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-body-font-family': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-primary-font-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-faintest-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-faint-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-light-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-primary-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-secondary-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-tertiary-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-primary-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--spell-level-button-available-slots-text-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-white': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-faint-white': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-linked-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-unlinked-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-linked-light-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-unlinked-light-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-sheet-unlocked-icon-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-sheet-locked-icon-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-header-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-prepareable-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-equipped-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-equipped-item-grid-tile-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-equipped-item-grid-tile-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-prepared-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-prepared-item-grid-tile-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-prepared-item-grid-tile-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-pact-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-pact-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-pact-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-atwill-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-atwill-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-atwill-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-innate-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-innate-outline': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-innate-accent': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-alwaysprepared-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-alwaysprepared-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-alwaysprepared-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-magic-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-faint-magic-item-list-row-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-magic-item-grid-tile-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-attunement-required-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-attuned-item-grid-icon-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-xp-bar-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-encumbrance-bar-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-encumbrance-bar-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-encumbrance-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-warning-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-warning-accent-contrast-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-icon-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-icon-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-icon-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-icon-font-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-icon-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-ability-modifiers-hover-label-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-exhaustion-severity1-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-exhaustion-severity2-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-exhaustion-severity3-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-ability-accent-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-context-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-context-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-check-default-background-image': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-check-checked-background-image': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-checkbox-font-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-checkbox-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-checkbox-unchecked-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-checkbox-checked-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-item-input-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-item-input-hover-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-encumbrance-text-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-death-save-icon-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-inspiration-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-inspiration-text-shadow-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-inspiration-inspired-text-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-inspiration-inspired-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-vehicle-motion-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-vehicle-motion-text-shadow-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-vehicle-in-motion-text-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-vehicle-in-motion-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-hp-bar-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-resource-bar-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-death-save-backdrop-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-death-save-text-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-hp-overlay-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-inventory-grid-image-contrast-text-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-inventory-grid-hover-use-item-contrast-text-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-sheet-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-item-info-card-background': {
    type: 'todo',
    group: 'todo,',
  },
  '--t5ek-content-entity-link-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-content-entity-link-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-content-entity-link-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-content-entity-link-hover-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-activated-profile-toggle-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-exhaustion-severity1-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-exhaustion-severity2-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-exhaustion-severity3-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-death-save-text-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-tinymce-toolbar-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-tinymce-sidebar-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-tinyme-toolbar-button-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-prosemirror-button-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-prosemirror-dropdown-item-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-item-info-card-box-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-sheet-lock-icon-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-grid-pane-favorite-icon-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-settings-dialog-box-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-sheet-lock-icon-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-settings-dialog-border-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-spell-level-button-border-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-ability-modifiers-label-text-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-ability-mod-text-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-ability-mod-save-text-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-encumbrance-bar-text-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-button-menu-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-button-menu-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-button-menu-divider-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-focus-visible-box-shadow': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-button-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-button-hover-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-button-disabled-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-separator-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-table-header-row-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-table-header-row-border-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-tab-strip-border-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-tabs-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-active-tab-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5ek-tab-background': {
    type: 'todo',
    group: 'todo',
  },
};
