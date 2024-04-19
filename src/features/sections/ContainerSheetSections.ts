import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { Item5e } from 'src/types/item.types';
import type { InventorySection } from 'src/types/types';

export class ContainerSheetSections {
  static applyContentsItemToSection(
    inventory: Record<string, InventorySection> & {
      contents: InventorySection;
    },
    item: Item5e,
    customSectionOptions?: Partial<InventorySection>
  ) {
    const customSectionName = TidyFlags.section.get(item);

    if (!customSectionName) {
      inventory.contents.items.push(item);
      return;
    }

    const customSection: InventorySection = (inventory[customSectionName] ??= {
      dataset: { [TidyFlags.section.prop]: customSectionName },
      items: [],
      label: customSectionName,
      canCreate: false,
      key: customSectionName,
      custom: {
        section: customSectionName,
        creationItemTypes: [],
      },
      show: true,
      ...customSectionOptions,
    });

    customSection.items.push(item);
  }
}
