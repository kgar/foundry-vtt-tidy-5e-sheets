import { Tidy5eSheetsApi, TidyFlags } from 'src/api';
import { CONSTANTS } from 'src/constants';

export function initKeybindings() {
  registerSheetLockToggleKeybinding();
  registerHeaderMenuToggleKeybinding();
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

      if (!sheetDocument) {
        return;
      }

      const applicationElement =
        sheetDocument.sheet?.form ?? sheetDocument.sheet?.element;

      const isQuadrone = !!applicationElement?.classList.contains(
        CONSTANTS.SHEET_LAYOUT_QUADRONE
      );

      if (isQuadrone) {
        await sheetDocument.sheet.toggleSheetMode?.();
      } else {
        const allowEdit = TidyFlags.allowEdit.get(sheetDocument);
        await TidyFlags.allowEdit.set(sheetDocument, !allowEdit);
      }
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
