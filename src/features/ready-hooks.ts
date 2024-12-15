import { Tidy5eSheetsApi } from 'src/api/Tidy5eSheetsApi';
import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';

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

    const classFilter = TidyFlags.classFilter.get(parent);

    if (classFilter) {
      item.update({
        [`system.sourceClass`]: classFilter,
      });
    }
  });
}
