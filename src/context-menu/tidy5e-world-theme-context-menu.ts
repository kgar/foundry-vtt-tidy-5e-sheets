import type { WorldSettingsQuadroneApplication } from 'src/applications/settings/world/TidyWorldSettingsQuadroneApplication.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import { TidyHooks } from 'src/foundry/TidyHooks';
import type { TidyExtensibleDocumentSheetMixinInstance } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import type { WorldThemeSettingEntry } from 'src/settings/editors/world-themes-settings-editor.svelte';
import { ThemeImportService } from 'src/theme/theme-import-service';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';

export function configureWorldThemeContextMenu(
  element: HTMLElement,
  app: WorldSettingsQuadroneApplication,
) {
  const { themeId } =
    element.closest<HTMLElement>('[data-theme-id]')?.dataset ?? {};

  const theme = $state.snapshot(
    app.editors.themesSettingsTab.value.settings.find(
      (setting) => setting.id === themeId,
    ),
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
      label: 'SIDEBAR Duplicate',
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
        const abortController = new AbortController();

        const elem = document.createElement('input');
        elem.type = 'file';
        elem.addEventListener(
          'cancel',
          () => {
            abortController.abort();
          },
          { signal: abortController.signal },
        );

        elem.addEventListener(
          'change',
          () => {
            abortController.abort();
            if (elem.files.length === 1) {
              ui.notifications.info('File selected: ' + elem.files[0]);
            }
          },
          { signal: abortController.signal },
        );
        elem.click();
      },
      group: 'common',
    },
    {
      label: 'TIDY5E.SETTINGS.Theme.Action.Export',
      icon: 'fa-solid fa-file-export fa-fw',
      onClick: (event, target) => {
        ThemeImportService.export({
          ...ThemeQuadrone.getDefaultThemeSettings(),
          ...theme,
        });
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
