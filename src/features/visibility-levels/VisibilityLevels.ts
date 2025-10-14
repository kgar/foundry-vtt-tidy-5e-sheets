import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export type VisibilityLevelOption = {
  key: string;
  label: string;
  value: number | null;
};

export class VisibilityLevels {
  static getLevels() {
    return {
      limited: {
        key: 'limited',
        label: FoundryAdapter.localize('OWNERSHIP.LIMITED'),
        value: CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED,
      },
      observer: {
        key: 'observer',
        label: FoundryAdapter.localize('OWNERSHIP.OBSERVER'),
        value: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
      },
      owner: {
        key: 'owner',
        label: FoundryAdapter.localize('OWNERSHIP.OWNER'),
        value: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
      },
      gmOnly: {
        key: 'gmOnly',
        label: FoundryAdapter.localize('TIDY5E.GMOnly.Title'),
        value: Number.MAX_SAFE_INTEGER,
      },
    } satisfies Record<string, VisibilityLevelOption>;
  }

  static getOptions(documentName: string): VisibilityLevelOption[] {
    const levels = VisibilityLevels.getLevels();

    levels[VisibilityLevels.getDefaultLevelKey(documentName)].value = null;

    let options = [];

    if (documentName === CONSTANTS.DOCUMENT_NAME_ITEM) {
      options.push(levels.limited);
    }

    options.push(levels.observer, levels.owner);

    if (FoundryAdapter.userIsGm()) {
      options.push(levels.gmOnly);
    }

    return options;
  }

  static getDefaultLevelKey(
    documentName: string
  ): keyof ReturnType<(typeof VisibilityLevels)['getLevels']> {
    return documentName === CONSTANTS.DOCUMENT_NAME_ITEM
      ? 'limited'
      : 'observer';
  }

  static getDefaultLevelValue(documentName: string) {
    return VisibilityLevels.getLevels()[
      VisibilityLevels.getDefaultLevelKey(documentName)
    ].value;
  }
}
