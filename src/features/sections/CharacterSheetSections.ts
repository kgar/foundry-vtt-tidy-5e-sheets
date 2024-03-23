import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Item5e } from 'src/types/item.types';
import type { InventorySection } from 'src/types/types';

export class CharacterSheetSections {
  static get inventoryItemTypes() {
    return ['weapon', 'equipment', 'consumable', 'tool', 'container', 'loot'];
  }

  static applyInventoryItemToSection(
    inventory: Record<string, InventorySection>,
    item: Item5e,
    customSectionOptions: Partial<InventorySection>
  ) {
    const customSectionName = SheetSections.tryGetCustomSection(item);

    if (!customSectionName) {
      inventory[item.type].items.push(item);
      return;
    }

    const customSection: InventorySection = (inventory[customSectionName] ??= {
      dataset: { [SheetSections.sectionPropertyPath]: customSectionName },
      items: [],
      label: customSectionName,
      canCreate: true,
      custom: {
        creationItemTypes: CharacterSheetSections.inventoryItemTypes,
      },
      ...customSectionOptions,
    });

    customSection.items.push(item);
  }
}

export class SheetSections {
  static get sectionProperty() {
    return 'section';
  }

  static get sectionPropertyPath() {
    return `flags.${CONSTANTS.MODULE_ID}.${SheetSections.sectionProperty}`;
  }

  static tryGetCustomSection(item: Item5e): string {
    return FoundryAdapter.tryGetFlag<string>(item, 'section')?.trim() ?? '';
  }
}
