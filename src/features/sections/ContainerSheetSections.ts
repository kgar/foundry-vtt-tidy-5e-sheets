import { TidyFlags } from 'src/foundry/TidyFlags';
import type { ContainerSection, Item5e } from 'src/types/item.types';
import { Inventory } from './Inventory';

export class ContainerSheetSections {
  static applyContentsItemToSection(
    inventory: Record<string, ContainerSection>,
    item: Item5e,
    customSectionOptions?: Partial<ContainerSection>
  ) {
    const customSectionName = TidyFlags.section.get(item);

    if (!customSectionName) {
      const defaultSection = (inventory[item.type] ??= {
        items: [],
        label: Inventory.getInventoryTypeLabel(item.type),
        dataset: {},
        key: item.type,
        show: true,
      });
      defaultSection.items.push(item);
      return;
    }

    const customSection: ContainerSection = (inventory[customSectionName] ??= {
      dataset: { [TidyFlags.section.prop]: customSectionName },
      items: [],
      label: customSectionName,
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
