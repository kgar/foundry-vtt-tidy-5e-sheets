import type { Item5e } from 'src/types/item.types';
import { FoundryAdapter } from './foundry-adapter';

/** Manages Tidy flags. */
export class TidyFlags {
  /**
   * Determines whether an item whose default Action List behavior has been overridden
   * to be included (`true`) or excluded (`false`).
   * `undefined` means there is no override and standard Action List logic should be used.
   * */
  static actionFilterOverride = {
    /** Get the item's Action Filter Override setting. */
    get(item: Item5e): boolean | undefined {
      return (
        FoundryAdapter.tryGetFlag<boolean>(item, 'action-filter-override') ??
        undefined
      );
    },
    /** Set the item's Action Filter Override setting. */
    set(item: Item5e, value: boolean): Promise<void> {
      return FoundryAdapter.setFlag(item, 'action-filter-override', value);
    },
    /**
     * Clear the item's Action Filter Override setting,
     * meaning the item should use the standard Action List logic
     * for inclusion or exclusion. */
    unset(item: Item5e) {
      return FoundryAdapter.unsetFlag(item, 'action-filter-override');
    },
  };
}
