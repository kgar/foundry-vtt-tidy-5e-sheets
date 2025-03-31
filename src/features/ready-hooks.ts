import { Tidy5eSheetsApi } from 'src/api/Tidy5eSheetsApi';
import { CONSTANTS } from 'src/constants';
import { isNil } from 'src/utils/data';

export function initReadyHooks() {
  assignDroppedSpellsToClassFilter();
}

function assignDroppedSpellsToClassFilter() {
  Hooks.on('createItem', (item: any) => {
    const parent = item.parent;
    const api = Tidy5eSheetsApi._getApi();

    if (!parent?.sheet?.element || !api.isTidy5eSheet(parent.sheet)) {
      return;
    }

    if (item.type !== CONSTANTS.ITEM_TYPE_SPELL) {
      return;
    }

    if (!isNil(parent.sheet?.classSpellbookFilter, '')) {
      item.update({
        [`system.sourceClass`]: parent.sheet.classSpellbookFilter,
      });
    }
  });
}
