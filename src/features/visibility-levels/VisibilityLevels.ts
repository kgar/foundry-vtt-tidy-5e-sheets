import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export type VisibilityLevelOption = {
  key: string;
  label: string;
  value: number | null;
};

export class VisibilityLevels {
  static get levels() {
    return {
      observer: {
        key: 'observer',
        label: FoundryAdapter.localize('OWNERSHIP.OBSERVER'),
        value: null,
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

  static getOptions(): VisibilityLevelOption[] {
    let options = [this.levels.observer, this.levels.owner];

    if (FoundryAdapter.userIsGm()) {
      options.push(this.levels.gmOnly);
    }

    return options;
  }
}
