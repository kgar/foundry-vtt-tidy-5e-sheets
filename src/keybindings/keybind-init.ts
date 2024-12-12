import { Tidy5eSheetsApi, TidyFlags } from 'src/api';
import { CONSTANTS } from 'src/constants';

export function initKeybindings() {
  registerSheetLockToggleKeybinding();
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

      const allowEdit = TidyFlags.allowEdit.get(sheetDocument);
      await TidyFlags.allowEdit.set(sheetDocument, !allowEdit);
    },
    onUp: () => {},
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });
}
