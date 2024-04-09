import type { Item5e } from 'src/types/item.types';
import { FoundryAdapter } from './foundry-adapter';
import type { SheetTabSectionConfigs } from 'src/features/sections/sections.types';
import { CONSTANTS } from 'src/constants';

/** Manages Tidy flags. */
export class TidyFlags {
  static getFlagPropertyPath(key: string) {
    return `flags.${CONSTANTS.MODULE_ID}.${key}`;
  }

  /**
   * Determines whether an item whose default Action List behavior has been overridden
   * to be included (`true`) or excluded (`false`).
   * `undefined` means there is no override and standard Action List logic should be used.
   * */
  static actionFilterOverride = {
    key: 'action-filter-override' as const,
    prop: TidyFlags.getFlagPropertyPath('action-filter-override'),
    /** Gets the item's Action Filter Override setting. */
    get(item: Item5e): boolean | undefined {
      return (
        FoundryAdapter.tryGetFlag<boolean>(
          item,
          TidyFlags.actionFilterOverride.key
        ) ?? undefined
      );
    },
    /** Sets the item's Action Filter Override setting. */
    set(item: Item5e, value: boolean): Promise<void> {
      return FoundryAdapter.setFlag(
        item,
        TidyFlags.actionFilterOverride.key,
        value
      );
    },
    /**
     * Clears the item's Action Filter Override setting,
     * meaning the item should use the standard Action List logic
     * for inclusion or exclusion. */
    unset(item: Item5e) {
      return FoundryAdapter.unsetFlag(item, TidyFlags.actionFilterOverride.key);
    },
  };

  static actionSection = {
    key: 'actionSection' as const,
    prop: TidyFlags.getFlagPropertyPath('actionSection'),
    get(item: Item5e): string | undefined {
      return (
        FoundryAdapter.tryGetFlag<string>(item, TidyFlags.actionSection.key) ??
        undefined
      );
    },
    set(item: Item5e, value: string) {
      return FoundryAdapter.setFlag(item, TidyFlags.actionSection.key, value);
    },
    unset(item: Item5e) {
      return FoundryAdapter.unsetFlag(item, TidyFlags.actionSection.key);
    },
  };

  /** Determines the order of item table sections for a given document sheet. */
  static sectionConfig = {
    key: 'sheet-section-config' as const,
    prop: TidyFlags.getFlagPropertyPath('sheet-section-config'),
    /** Gets the document sheet's section configuration. `undefined` means to use the default settings. */
    get(document: any): SheetTabSectionConfigs | undefined {
      return (
        FoundryAdapter.tryGetFlag<SheetTabSectionConfigs>(
          document,
          TidyFlags.sectionConfig.key
        ) ?? undefined
      );
    },
    /** Sets the document sheet's configuration. */
    set(document: any, value: SheetTabSectionConfigs) {
      return FoundryAdapter.setFlag(
        document,
        TidyFlags.sectionConfig.key,
        value
      );
    },
    /**
     * Clears the document sheet's section config,
     * meaning the target actor should use default settings.
     * */
    unset(document: any) {
      return FoundryAdapter.unsetFlag(document, TidyFlags.sectionConfig.key);
    },
  };

  static section = {
    key: 'section' as const,
    prop: TidyFlags.getFlagPropertyPath('section'),
    get(item: Item5e): string | undefined {
      return (
        FoundryAdapter.tryGetFlag<string>(item, TidyFlags.section.key) ??
        undefined
      );
    },
    set(item: Item5e, value: string) {
      return FoundryAdapter.setFlag(item, TidyFlags.section.key, value);
    },
    unset(item: Item5e) {
      return FoundryAdapter.unsetFlag(item, TidyFlags.section.key);
    },
  };
}
