import { Tidy5eSheetsApi } from 'src/api/Tidy5eSheetsApi';
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SettingsProvider } from 'src/settings/settings.svelte';
import { getThemeV2 } from 'src/theme/theme';

export function initKeybindings() {
  registerSheetLockToggleKeybinding();
  registerHeaderMenuToggleKeybinding();
  registerSheetToggleKeybinding();
  registerThemeToggleKeybinding();
}

function registerSheetLockToggleKeybinding() {
  game.keybindings.register(CONSTANTS.MODULE_ID, 'toggleSheetLock', {
    name: 'TIDY5E.Keybindings.ToggleSheetLock.Name',
    hint: 'TIDY5E.Keybindings.ToggleSheetLock.Hint',
    onDown: async () => {
      const tidyApi = Tidy5eSheetsApi._getApi();

      if (!ui.activeWindow || !tidyApi.isTidy5eSheet(ui.activeWindow)) {
        return;
      }

      const sheetDocument = ui.activeWindow.document;

      if (!sheetDocument || !sheetDocument.sheet?.isEditable) {
        return;
      }

      await sheetDocument.sheet.toggleSheetMode?.();
    },
    onUp: () => {},
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });
}

function registerHeaderMenuToggleKeybinding() {
  game.keybindings.register(CONSTANTS.MODULE_ID, 'toggleHeaderMenu', {
    name: 'TIDY5E.Keybindings.ToggleHeaderMenu.Name',
    hint: 'TIDY5E.Keybindings.ToggleHeaderMenu.Hint',
    onDown: async () => {
      const tidyApi = Tidy5eSheetsApi._getApi();

      if (!ui.activeWindow || !tidyApi.isTidy5eSheet(ui.activeWindow)) {
        return;
      }

      ui.activeWindow.toggleControls?.();
    },
    onUp: () => {},
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
    editable: [
      {
        key: 'KeyB',
        modifiers: ['Alt'],
      },
    ],
  });
}

function registerSheetToggleKeybinding() {
  if (SettingsProvider.settings.debug.get() === false) {
    return;
  }

  new QuickSheetSwitchKeybind({
    registrationKey: 'tidyQssQuadrone',
    name: 'Quick Sheet Switch - Tidy Quadrone Sheet',
    debounceDelay: 1000,
    invocationCountToTrigger: 3,
    getSheetKey: (sheetClasses) =>
      Object.keys(sheetClasses).find(
        (x) =>
          x.toLocaleLowerCase().includes('tidy') &&
          x.toLocaleLowerCase().includes('quadrone'),
      ),
    downKey: 'KeyQ',
    modifiers: ['Shift'],
  });

  new QuickSheetSwitchKeybind({
    registrationKey: 'tidyQssClassic',
    name: 'Quick Sheet Switch - Tidy Classic Sheet',
    debounceDelay: 1000,
    invocationCountToTrigger: 3,
    getSheetKey: (sheetClasses) =>
      Object.keys(sheetClasses).find(
        (x) =>
          x.toLocaleLowerCase().includes('tidy') &&
          !x.toLocaleLowerCase().includes('quadrone') &&
          !x.toLocaleLowerCase().includes('debug'),
      ),
    downKey: 'KeyT',
    modifiers: ['Shift'],
  });

  new QuickSheetSwitchKeybind({
    registrationKey: 'tidyQssDefault',
    name: 'Quick Sheet Switch - System Default Sheet',
    debounceDelay: 1000,
    invocationCountToTrigger: 3,
    getSheetKey: (sheetClasses) =>
      Object.entries(sheetClasses).find(
        ([key, value]) =>
          !key.toLocaleLowerCase().includes('tidy') &&
          value.toLocaleLowerCase().includes('default'),
      )?.[0],
    downKey: 'KeyD',
    modifiers: ['Shift'],
  });
}

function registerThemeToggleKeybinding() {
  if (SettingsProvider.settings.debug.get() === false) {
    return;
  }

  game.keybindings.register(CONSTANTS.MODULE_ID, 'tidyQuickThemeToggle', {
    name: 'Quick Theme Toggle',
    hint: 'Toggles theme between dark and light on a given sheet.',
    onDown: async () => {
      const doc = ui.activeWindow?.document;
      if (!doc) {
        return;
      }

      const currentTheme = getThemeV2(doc);
      const newTheme = currentTheme == 'light' ? 'dark' : 'light';

      const themes = game.settings.get('core', 'sheetThemes');
      themes.documents ??= {};
      themes.documents[doc.uuid] = newTheme;
      await game.settings.set('core', 'sheetThemes', themes);

      if (doc.sheet.applyTidyTheming) {
        doc.sheet.applyTidyTheming();
      } else {
        doc._onSheetChange({ sheetOpen: true });
      }
    },
    onUp: () => {},
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
    editable: [
      {
        key: 'KeyL',
        modifiers: ['Alt'],
      },
    ],
  });
}

type QuickSheetSwitchKeybindSettings = {
  registrationKey: string;
  downKey: string;
  modifiers?: string[];
  getSheetKey: (sheetClasses: Record<string, string>) => string | undefined;
  name: string;
  debounceDelay: number;
  invocationCountToTrigger: number;
};

class QuickSheetSwitchKeybind {
  _settings: QuickSheetSwitchKeybindSettings;

  constructor(settings: QuickSheetSwitchKeybindSettings) {
    this._settings = settings;
    this.register();
  }

  register() {
    let {
      debounceDelay,
      getSheetKey,
      downKey,
      name,
      invocationCountToTrigger,
      modifiers,
      registrationKey,
    } = this._settings;

    let switchKeyInvocationCount = 0;

    let debouncedInovationCountReset = FoundryAdapter.debounce(() => {
      switchKeyInvocationCount = 0;
    }, debounceDelay);

    game.keybindings.register(CONSTANTS.MODULE_ID, registrationKey, {
      name: name,
      hint: `Press this keybind combination ${invocationCountToTrigger} times in a row to switch the indicated sheet type.`,
      onDown: async () => {
        if (!ui.activeWindow) {
          return;
        }

        if (switchKeyInvocationCount >= invocationCountToTrigger - 1) {
          const { sheetClasses } =
            foundry.applications.apps.DocumentSheetConfig.getSheetClassesForSubType(
              ui.activeWindow.document.documentName,
              ui.activeWindow.document.type,
            );

          const sheetKey = getSheetKey(sheetClasses);

          if (!sheetKey) {
            return;
          }

          ui.activeWindow.document.setFlag('core', 'sheetClass', sheetKey);
        } else {
          switchKeyInvocationCount++;
          debouncedInovationCountReset();
        }
      },
      onUp: () => {},
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
      editable: [
        {
          key: downKey,
          modifiers: modifiers ?? [],
        },
      ],
    });
  }
}
