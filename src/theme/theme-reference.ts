import { CONSTANTS } from 'src/constants';
import { defaultDarkTheme } from './default-dark-theme';
import { defaultLightTheme } from './default-light-theme';
import type { Tidy5eTheme } from 'src/types/theme';

export function getCoreThemes(includeDefault: boolean) {
  let themes: Record<string, string> = {};

  if (includeDefault) {
    themes[CONSTANTS.THEME_ID_DEFAULT] = 'TIDY5E.Settings.SheetTheme.default';
  }

  themes[CONSTANTS.THEME_ID_DEFAULT_LIGHT] = defaultLightTheme.name;
  themes[CONSTANTS.THEME_ID_DEFAULT_DARK] = defaultDarkTheme.name;

  return themes;
}

/**
 * Provides a record where the key is the theme ID and the value is the theme definition.
 * @returns all registered themes
 */
export function getThemes(): Record<string, Tidy5eTheme> {
  return {
    [CONSTANTS.THEME_ID_DEFAULT_LIGHT]: defaultLightTheme,
    [CONSTANTS.THEME_ID_DEFAULT_DARK]: defaultDarkTheme,
  };
}

export const themeVariables = {
  '--t5e-title-font-family': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-body-font-family': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-primary-font-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-faintest-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-faint-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-light-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-primary-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-secondary-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-tertiary-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-primary-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--spell-level-button-available-slots-text-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-white': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-faint-white': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-linked-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-unlinked-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-linked-light-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-unlinked-light-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-sheet-unlocked-icon-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-sheet-locked-icon-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-header-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-prepareable-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-equipped-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-equipped-item-grid-tile-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-equipped-item-grid-tile-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-prepared-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-prepared-item-grid-tile-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-prepared-item-grid-tile-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-pact-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-pact-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-pact-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-atwill-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-atwill-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-atwill-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-innate-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-innate-outline': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-innate-accent': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-alwaysprepared-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-alwaysprepared-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-alwaysprepared-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-magic-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-attunement-required-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-attuned-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-attuned-item-grid-icon-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-xp-bar-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-encumbrance-bar-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-encumbrance-bar-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-encumbrance-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-warning-accent-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-warning-accent-contrast-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-icon-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-icon-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-icon-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-icon-font-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-icon-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-ability-modifiers-hover-label-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-exhaustion-severity1-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-exhaustion-severity2-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-exhaustion-severity3-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-ability-accent-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-context-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-context-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-check-default-background-image': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-check-checked-background-image': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-checkbox-font-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-checkbox-outline-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-checkbox-unchecked-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-checkbox-checked-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-item-input-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-item-input-hover-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-encumbrance-text-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-death-save-icon-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-inspiration-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-inspiration-text-shadow-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-inspiration-inspired-text-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-inspiration-inspired-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-vehicle-motion-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-vehicle-motion-text-shadow-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-vehicle-in-motion-text-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-vehicle-in-motion-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-hp-bar-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-resource-bar-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-death-save-backdrop-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-death-save-text-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-hp-overlay-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-inventory-grid-image-contrast-text-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-inventory-grid-hover-use-item-contrast-text-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-sheet-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-item-info-card-background': {
    type: 'todo',
    group: 'todo,',
  },
  '--t5e-content-entity-link-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-content-entity-link-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-content-entity-link-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-content-entity-link-hover-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-activated-profile-toggle-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-exhaustion-severity1-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-exhaustion-severity2-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-exhaustion-severity3-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-death-save-text-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-tinymce-toolbar-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-tinymce-sidebar-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-tinyme-toolbar-button-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-prosemirror-button-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-prosemirror-dropdown-item-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-item-info-card-box-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-sheet-lock-icon-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-grid-pane-favorite-icon-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-settings-dialog-box-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-sheet-lock-icon-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-settings-dialog-border-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-spell-level-button-border-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-ability-modifiers-label-text-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-ability-mod-text-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-ability-mod-save-text-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-encumbrance-bar-text-shadow-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-button-menu-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-button-menu-hover-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-button-menu-divider-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-focus-visible-box-shadow': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-button-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-button-hover-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-button-disabled-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-separator-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-table-header-row-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-table-header-row-border-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-tab-strip-border-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-tabs-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-active-tab-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-tab-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-scrollbar-thumb-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-scrollbar-track-color': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-spell-pip-active-background': {
    type: 'todo',
    group: 'todo',
  },
  '--t5e-spell-pip-empty-background': {
    type: 'todo',
    group: 'todo',
  },
};
