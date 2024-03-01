import { CONSTANTS } from 'src/constants';
import type { Tidy5eTheme } from 'src/types/theme';

export const defaultDarkTheme: Tidy5eTheme = {
  name: 'TIDY5E.Settings.SheetTheme.dark',
  id: CONSTANTS.THEME_ID_DEFAULT_DARK,
  description: 'The default Tidy 5e Dark theme.',
  variables: {
    '--t5e-title-font-family':
      "'Modesto Condensed', 'Palatino Linotype', serif",
    '--t5e-body-font-family': "'Signika', sans-serif",
    '--t5e-primary-font-color': 'rgba(255, 255, 255, 0.8)',
    '--t5e-background': 'rgba(30, 30, 30, 1)',
    '--t5e-faintest-color': 'rgba(255, 255, 255, 0.05)',
    '--t5e-faint-color': 'rgba(255, 255, 255, 0.1)',
    '--t5e-light-color': 'rgba(255, 255, 255, 0.25)',
    '--t5e-primary-color': 'rgba(255, 255, 255, 0.8)',
    '--t5e-secondary-color': 'rgba(255, 255, 255, 0.65)',
    '--t5e-tertiary-color': 'rgba(255, 255, 255, 0.4)',
    '--t5e-primary-accent-color': 'hsl(23.53, 80%, 50%)',
    '--spell-level-button-available-slots-text-color': 'white',
    '--t5e-white': 'rgba(0, 0, 0, 1)',
    '--t5e-faint-white': 'rgba(255, 255, 255, 0.2)',
    '--t5e-linked-accent-color': 'rgba(0, 255, 0, 0.75)',
    '--t5e-unlinked-accent-color': 'rgba(255, 0, 0, 0.75)',
    '--t5e-linked-light-color': 'rgba(0, 255, 0, 0.4)',
    '--t5e-unlinked-light-color': 'rgba(255, 0, 0, 0.4)',
    '--t5e-sheet-unlocked-icon-background': 'rgba(0, 150, 100, 0.6)',
    '--t5e-sheet-locked-icon-background': 'rgba(255, 0, 0, 0.6)',
    '--t5e-header-background': 'rgba(255, 255, 255, 0.05)',
    '--t5e-prepareable-color': 'rgba(119, 136, 153, 1)',
    '--t5e-equipped-background': 'rgba(0, 250, 180, 0.3)',
    '--t5e-equipped-item-grid-tile-outline-color': 'rgba(50, 205, 50, 1)',
    '--t5e-equipped-item-grid-tile-accent-color': 'rgba(173, 255, 47, 1)',
    '--t5e-prepared-background': 'rgba(0, 250, 180, 0.3)',
    '--t5e-prepared-item-grid-tile-outline-color': 'rgba(50, 205, 50, 1)',
    '--t5e-prepared-item-grid-tile-accent-color': 'rgba(173, 255, 47, 1)',
    '--t5e-pact-background': 'rgba(250, 0, 180, 0.3)',
    '--t5e-pact-outline-color': 'rgba(250, 50, 213, 1)',
    '--t5e-pact-accent-color': 'rgba(198, 119, 193, 1)',
    '--t5e-atwill-background': 'rgba(226, 246, 4, 0.3)',
    '--t5e-atwill-outline-color': 'rgba(163, 165, 50, 1)',
    '--t5e-atwill-accent-color': 'rgba(255, 242, 0, 1)',
    '--t5e-innate-background': 'rgba(255, 0, 0, 0.3)',
    '--t5e-innate-outline': 'rgba(231, 23, 23, 1)',
    '--t5e-innate-accent': 'rgba(195, 69, 69, 1)',
    '--t5e-alwaysprepared-background': 'rgba(0, 100, 255, 0.3)',
    '--t5e-alwaysprepared-outline-color': 'rgba(65, 105, 225, 1)',
    '--t5e-alwaysprepared-accent-color': 'rgba(0, 191, 255, 1)',
    '--t5e-magic-accent-color': '#ada11a',
    '--t5e-attunement-required-color': 'var(--t5e-light-color)',
    '--t5e-attuned-color': 'var(--t5e-primary-accent-color)',
    '--t5e-attuned-item-grid-icon-color': 'rgba(0, 0, 0, 0.4)',
    '--t5e-xp-bar-background': 'rgba(94, 225, 146, 1)',
    '--t5e-encumbrance-bar-background': 'rgba(108, 138, 165, 1)',
    '--t5e-encumbrance-bar-outline-color': 'rgba(205, 228, 255, 1)',
    '--t5e-encumbrance-outline-color': 'rgba(0, 0, 0, 0.9)',
    '--t5e-warning-accent-color': 'rgba(255, 30, 0, 0.65)',
    '--t5e-warning-accent-contrast-color': 'rgba(255, 255, 255, 0.8)',
    '--t5e-icon-background': 'rgba(30, 30, 30, 1)',
    '--t5e-icon-shadow-color': 'rgba(0, 0, 0, 0.4)',
    '--t5e-icon-outline-color': 'rgba(0, 0, 0, 0.4)',
    '--t5e-icon-font-color': 'rgba(255, 255, 255, 0.4)',
    '--t5e-icon-hover-color': 'rgba(255, 255, 255, 0.8)',
    '--t5e-ability-modifiers-hover-label-background': 'rgba(0, 0, 0, 0.9)',
    '--t5e-exhaustion-severity1-background': 'rgba(255, 230, 0, 1)',
    '--t5e-exhaustion-severity2-background': 'rgba(255, 130, 0, 1)',
    '--t5e-exhaustion-severity3-background': 'rgba(255, 50, 0, 1)',
    '--t5e-ability-accent-background': 'rgb(80, 80, 80)',
    '--t5e-context-outline-color': 'rgba(0, 0, 0, 0.4)',
    '--t5e-context-shadow-color': 'rgba(0, 0, 0, 0.65)',
    '--t5e-check-default-background-image':
      "url('../../modules/tidy5e-sheet/images/check-dark-unchecked.svg')",
    '--t5e-check-checked-background-image':
      "url('../../modules/tidy5e-sheet/images/check-light-checked.svg')",
    '--t5e-checkbox-font-color': 'rgba(255, 255, 255, 0.8)',
    '--t5e-checkbox-outline-color': 'rgba(50, 50, 50, 1)',
    '--t5e-checkbox-unchecked-color': 'rgba(75, 75, 75, 1)',
    '--t5e-checkbox-checked-color': 'rgba(0, 255, 0, 0.5)',
    '--t5e-item-input-background': 'rgba(255, 255, 255, 0.1)',
    '--t5e-item-input-hover-background': 'rgba(255, 255, 255, 0.2)',
    '--t5e-encumbrance-text-color': 'rgba(238, 238, 238, 1)',
    '--t5e-death-save-icon-color': 'rgba(255, 255, 255, 0.75)',
    '--t5e-death-save-text-color': 'white',
    '--t5e-inspiration-hover-color': 'rgba(255, 255, 255, 0.75)',
    '--t5e-inspiration-text-shadow-hover-color': 'rgba(118, 228, 255, 0.5)',
    '--t5e-inspiration-inspired-text-shadow-color': '#76e4ff',
    '--t5e-inspiration-inspired-background': 'rgba(153, 153, 153, 1)',
    '--t5e-vehicle-motion-hover-color': 'rgba(255, 255, 255, 0.75)',
    '--t5e-vehicle-motion-text-shadow-hover-color': 'rgba(118, 228, 255, 0.5)',
    '--t5e-vehicle-in-motion-text-shadow-color': '#76e4ff',
    '--t5e-vehicle-in-motion-background': 'rgba(153, 153, 153, 1)',
    '--t5e-hp-bar-color': 'rgba(50, 149, 50, 0.6)',
    '--t5e-resource-bar-color': 'rgba(21, 51, 98, 1)',
    '--t5e-death-save-backdrop-background': 'rgba(255, 0, 0, 0.5)',
    '--t5e-death-save-text-shadow-color': 'rgb(34, 34, 34)',
    '--t5e-hp-overlay-background': 'rgba(255, 0, 0, 1)',
    '--t5e-inventory-grid-image-contrast-text-shadow-color': 'rgba(0, 0, 0, 1)',
    '--t5e-inventory-grid-hover-use-item-contrast-text-shadow-color':
      'rgba(255, 255, 255, 1)',
    '--t5e-sheet-background': 'var(--t5e-background)',
    '--t5e-item-info-card-background': 'var(--t5e-background)',
    '--t5e-content-entity-link-color': 'var(--t5e-primary-font-color)',
    '--t5e-content-entity-link-hover-color': 'var(--t5e-primary-font-color)',
    '--t5e-content-entity-link-background': 'var(--t5e-faint-color)',
    '--t5e-content-entity-link-hover-background':
      'var(--t5e-primary-accent-color)',
    '--t5e-activated-profile-toggle-color': 'var(--t5e-primary-font-color)',
    '--t5e-exhaustion-severity1-color': 'var(--t5e-icon-outline-color)',
    '--t5e-exhaustion-severity2-color': 'rgba(255, 255, 255, 0.7)',
    '--t5e-exhaustion-severity3-color': 'rgba(255, 255, 255, 0.7)',
    '--t5e-tinymce-toolbar-background': '#fff',
    '--t5e-tinymce-sidebar-background': 'var(--t5e-secondary-color)',
    '--t5e-tinyme-toolbar-button-color': '#222',
    '--t5e-prosemirror-button-color': 'rgba(100, 100, 100, 1)',
    '--t5e-prosemirror-dropdown-item-hover-color': 'rgba(50, 50, 50, 1)',
    '--t5e-item-info-card-box-shadow-color': 'rgba(0, 0, 0, 0.5)',
    '--t5e-sheet-lock-icon-color': 'rgba(255, 255, 255, 0.6)',
    '--t5e-grid-pane-favorite-icon-color': 'rgba(0, 200, 100, 1)',
    '--t5e-settings-dialog-box-shadow-color': 'rgba(0, 0, 0, 0.75)',
    '--t5e-sheet-lock-icon-hover-color': '#fff',
    '--t5e-settings-dialog-border-color': '#ff6400',
    '--t5e-spell-level-button-border-color': '#c9c7b8',
    '--t5e-ability-modifiers-label-text-color': '#fff',
    '--t5e-ability-mod-text-color': '#fff',
    '--t5e-ability-mod-save-text-hover-color': '#fff',
    '--t5e-encumbrance-bar-text-shadow-color': '#000',
    '--t5e-button-menu-background': 'var(--t5e-sheet-background)',
    '--t5e-button-menu-hover-color': 'var(--t5e-faint-color)',
    '--t5e-button-menu-divider-color': 'var(--t5e-separator-color)',
    '--t5e-focus-visible-box-shadow':
      '-0.0625rem -0.0625rem 0 var(--t5e-primary-accent-color), -0.0625rem 0.0625rem 0 var(--t5e-primary-accent-color), 0.0625rem 0.0625rem 0 var(--t5e-primary-accent-color), 0.0625rem -0.0625rem 0 var(--t5e-primary-accent-color)',
    '--t5e-button-background': 'var(--t5e-faintest-color)',
    '--t5e-button-hover-background': 'var(--t5e-faint-color)',
    '--t5e-button-disabled-color': 'var(--t5e-light-color)',
    '--t5e-separator-color': 'rgba(120, 120, 120, 0.1)',
    '--t5e-table-header-row-color': '#111111',
    '--t5e-table-header-row-border-color': '#111111',
    '--t5e-tab-strip-border-color': 'transparent',
    '--t5e-tabs-background': 'var(--t5e-header-background)',
    '--t5e-active-tab-background': 'var(--t5e-sheet-background)',
    '--t5e-tab-background': 'transparent',
    '--t5e-scrollbar-thumb-color': '#782e22',
    '--t5e-scrollbar-track-color': '#0000',
    '--t5e-spell-pip-active-background': 'var(--t5e-primary-accent-color)',
    '--t5e-spell-pip-empty-background': 'var(--t5e-faint-color)',
    '--t5e-switch-slider-color': '#DDD',
  },
  type: 'dark',
};
