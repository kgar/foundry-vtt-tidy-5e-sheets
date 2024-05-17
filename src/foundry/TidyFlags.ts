import type { Item5e } from 'src/types/item.types';
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
        TidyFlags.tryGetFlag<boolean>(
          item,
          TidyFlags.actionFilterOverride.key
        ) ?? undefined
      );
    },
    /** Sets the item's Action Filter Override setting. */
    set(item: Item5e, value: boolean): Promise<void> {
      return TidyFlags.setFlag(item, TidyFlags.actionFilterOverride.key, value);
    },
    /**
     * Clears the item's Action Filter Override setting,
     * meaning the item should use the standard Action List logic
     * for inclusion or exclusion. */
    unset(item: Item5e) {
      return TidyFlags.unsetFlag(item, TidyFlags.actionFilterOverride.key);
    },
  };

  static actionSection = {
    key: 'actionSection' as const,
    prop: TidyFlags.getFlagPropertyPath('actionSection'),
    get(item: Item5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(item, TidyFlags.actionSection.key) ??
        undefined
      );
    },
    set(item: Item5e, value: string) {
      return TidyFlags.setFlag(item, TidyFlags.actionSection.key, value);
    },
    unset(item: Item5e) {
      return TidyFlags.unsetFlag(item, TidyFlags.actionSection.key);
    },
  };

  /**
   * Determines whether an actor's sheet should be editable per the sheet lock feature (default `true`).
   * @param actor the actor
   * @returns whether the sheet should be editable per the sheet lock feature
   */
  static allowEdit = {
    key: 'allow-edit',
    prop: TidyFlags.getFlagPropertyPath('allow-edit'),
    get(document: any): boolean {
      return TidyFlags.tryGetFlag<boolean>(document, 'allow-edit') ?? true;
    },
    set(document: any, value: boolean) {
      return TidyFlags.setFlag(document, TidyFlags.allowEdit.key, value);
    },
    unset(document: any) {
      return TidyFlags.unsetFlag(document, TidyFlags.allowEdit.key);
    },
  };

  static inventoryGrid = {
    key: 'inventory-grid',
    prop: TidyFlags.getFlagPropertyPath('inventory-grid'),
    get(document: any): boolean {
      return (
        TidyFlags.tryGetFlag<boolean>(document, TidyFlags.inventoryGrid.key) ===
        true
      );
    },
    set(document: any) {
      return TidyFlags.setFlag(document, TidyFlags.inventoryGrid.key, true);
    },
    unset(document: any) {
      return TidyFlags.unsetFlag(document, TidyFlags.inventoryGrid.key);
    },
  };

  /** Determines the order of item table sections for a given document sheet. */
  static sectionConfig = {
    key: 'sheet-section-config' as const,
    prop: TidyFlags.getFlagPropertyPath('sheet-section-config'),
    /** Gets the document sheet's section configuration. `undefined` means to use the default settings. */
    get(document: any): SheetTabSectionConfigs | undefined {
      return (
        TidyFlags.tryGetFlag<SheetTabSectionConfigs>(
          document,
          TidyFlags.sectionConfig.key
        ) ?? undefined
      );
    },
    /** Sets the document sheet's configuration. */
    set(document: any, value: SheetTabSectionConfigs) {
      return TidyFlags.setFlag(document, TidyFlags.sectionConfig.key, value);
    },
    /**
     * Clears the document sheet's section config,
     * meaning the target actor should use default settings.
     * */
    unset(document: any) {
      return TidyFlags.unsetFlag(document, TidyFlags.sectionConfig.key);
    },
  };

  static favorite = {
    key: 'favorite' as const,
    prop: TidyFlags.getFlagPropertyPath('favorite'),
    get(item: Item5e): boolean | undefined {
      return (
        TidyFlags.tryGetFlag<boolean>(item, TidyFlags.favorite.key) ?? undefined
      );
    },
    unset(item: Item5e) {
      return TidyFlags.unsetFlag(item, TidyFlags.favorite.key);
    },
  };

  static section = {
    key: 'section' as const,
    prop: TidyFlags.getFlagPropertyPath('section'),
    get(item: Item5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(item, TidyFlags.section.key) ?? undefined
      );
    },
    set(item: Item5e, value: string) {
      return TidyFlags.setFlag(item, TidyFlags.section.key, value);
    },
    unset(item: Item5e) {
      return TidyFlags.unsetFlag(item, TidyFlags.section.key);
    },
  };

  static spellbookGrid = {
    key: 'spellbook-grid',
    prop: TidyFlags.getFlagPropertyPath('spellbook-grid'),
    get(document: any): boolean {
      return (
        TidyFlags.tryGetFlag<boolean>(document, TidyFlags.spellbookGrid.key) ===
        true
      );
    },
    set(document: any) {
      return TidyFlags.setFlag(document, TidyFlags.spellbookGrid.key, true);
    },
    unset(document: any) {
      return TidyFlags.unsetFlag(document, TidyFlags.spellbookGrid.key);
    },
  };

  static tryGetFlag<T>(flagged: any, flagName: string) {
    return flagged.getFlag(CONSTANTS.MODULE_ID, flagName) as
      | T
      | null
      | undefined;
  }

  static setFlag(
    flagged: any,
    flagName: string,
    value: unknown
  ): Promise<void> {
    return flagged.setFlag(CONSTANTS.MODULE_ID, flagName, value);
  }

  static unsetFlag(flagged: any, flagName: string): Promise<void> {
    return flagged.unsetFlag(CONSTANTS.MODULE_ID, flagName);
  }
}
