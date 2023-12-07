import type { RegisterItemDetailsSectionOptions } from 'src/api/api.types';
import type { ItemTabBase } from 'src/api/item/ItemTabBase';
import { isNil } from 'src/utils/data';

export class ItemSheetRuntime {
  private static _itemDetailCustomSections: RegisterItemDetailsSectionOptions[] =
    [];
  private static _itemTabs: ItemTabBase[] = [];

  static registerDetailTabSection(section: RegisterItemDetailsSectionOptions) {
    // validate? Or let chaos reign?
    ItemSheetRuntime._itemDetailCustomSections.push(section);
  }

  static getCustomItemDetailSections(
    context: any
  ): RegisterItemDetailsSectionOptions[] {
    return [...ItemSheetRuntime._itemDetailCustomSections].filter(
      (s) => s.enabled === undefined || s.enabled(context)
    );
  }

  static registerTab(tab: ItemTabBase) {
    // validate? Or let chaos reign?
    const tabId = tab.tabId?.trim();
    if (isNil(tabId, '')) {
      tab.tabId = foundry.utils.randomID();
    }
    ItemSheetRuntime._itemTabs.push(tab);
  }

  static getTabs(context: any) {
    return ItemSheetRuntime._itemTabs.filter(
      (s) => s.enabled === undefined || s.enabled(context)
    );
  }
}
