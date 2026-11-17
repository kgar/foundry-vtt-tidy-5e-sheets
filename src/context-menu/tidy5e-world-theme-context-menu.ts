import type { WorldSettingsQuadroneApplication } from 'src/applications/settings/world/TidyWorldSettingsQuadroneApplication.svelte';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import { TidyHooks } from 'src/foundry/TidyHooks';
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
      label: 'TIDY5E.SETTINGS.Theme.Action.ApplyPreset',
      icon: 'fa-solid fa-sliders',
      onClick: (event, target) => {
        app.editors.themesSettingsTab.applyPreset(theme);
      },
      group: 'common',
    },
    {
      label: 'DND5E.ContextMenuActionDuplicate',
      icon: 'fa-solid fa-copy fa-fw',
      onClick: (event, target) => {
        const duplicatedId = theme.id;
        const newTheme = {
          ...foundry.utils.duplicate(theme),
          id: foundry.utils.randomID(),
        };

        let count = 0;
        app.editors.themesSettingsTab.value.settings =
          app.editors.themesSettingsTab.value.settings.reduce<
            WorldThemeSettingEntry[]
          >((prev, curr) => {
            count++;
            curr.sort = count;
            prev.push(curr);

            if (curr.id === duplicatedId) {
              count++;
              newTheme.sort = count;
              prev.push(newTheme);
            }

            return prev;
          }, []);
      },
      group: 'common',
    },
    {
      label: 'TIDY5E.SETTINGS.Theme.Action.Import',
      icon: 'fa-solid fa-file-import fa-fw',
      onClick: (event, target) => {
        app.editors.themesSettingsTab.import(theme);
      },
      group: 'common',
    },
    {
      label: 'TIDY5E.SETTINGS.Theme.Action.Export',
      icon: 'fa-solid fa-file-export fa-fw',
      onClick: (event, target) => {
        app.editors.themesSettingsTab.export(theme);
      },
      group: 'common',
    },
    {
      label: 'TIDY5E.CONTEXTMENU.Action.Delete',
      icon: 'fa-solid fa-trash fa-fw',
      onClick: (event, target) => {
        app.editors.themesSettingsTab.deleteTheme(theme.id);
      },
      group: 'be-careful',
    },
  ];
}
