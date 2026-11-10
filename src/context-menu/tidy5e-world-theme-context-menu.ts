import type { WorldSettingsQuadroneApplication } from 'src/applications/settings/world/TidyWorldSettingsQuadroneApplication.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import { TidyHooks } from 'src/foundry/TidyHooks';
import type { TidyExtensibleDocumentSheetMixinInstance } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import type { WorldThemeSettingEntry } from 'src/settings/editors/world-themes-settings-editor.svelte';

export function configureWorldThemeContextMenu(
  element: HTMLElement,
  app: WorldSettingsQuadroneApplication,
) {
  const { themeId } =
    element.closest<HTMLElement>('[data-theme-id]')?.dataset ?? {};

  const theme = app.editors.themesSettingsTab.value.settings.find(
    (setting) => setting.id === themeId,
  );

  if (!theme) {
    return;
  }

  ui.context.menuItems = getWorldThemeContextOptions(app, theme);

  TidyHooks.tidy5eSheetsGetWorldThemeContextOptions(
    app.document,
    theme,
    ui.context.menuItems,
  );
}

/**
 * Prepare an array of context entries for world theme setting entries.
 * @param app        The calling application.
 * @param theme      The world theme in question.
 * @returns          Context menu options.
 */
function getWorldThemeContextOptions(
  app: WorldSettingsQuadroneApplication,
  theme: WorldThemeSettingEntry,
): ContextMenuEntry[] {
  return [
    {
      label: 'TODO Duplicate',
      icon: 'fa-solid fa-poo-storm',
      onClick: (event, target) => {
        // TODO: implement
      },
    },
    {
      label: 'TODO Import',
      icon: 'fa-solid fa-poo-storm',
      onClick: (event, target) => {
        // TODO: implement
      },
    },
    {
      label: 'TODO Export',
      icon: 'fa-solid fa-poo-storm',
      onClick: (event, target) => {
        // TODO: implement
      },
    },
    {
      label: 'TODO Delete',
      icon: 'fa-solid fa-poo-storm',
      onClick: (event, target) => {
        // TODO: implement
      },
    },
  ];
}
