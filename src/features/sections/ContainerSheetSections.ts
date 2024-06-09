import { TidyFlags } from 'src/foundry/TidyFlags';
import type { ContainerSection, Item5e } from 'src/types/item.types';

export class ContainerSheetSections {
  static applyContentsItemToSection(
    inventory: Record<string, ContainerSection>,
    item: Item5e,
    customSectionOptions?: Partial<ContainerSection>
  ) {
    const customSectionName = TidyFlags.section.get(item);

    const defaultSection = inventory[item.type];
    if (!customSectionName && !!defaultSection) {
      defaultSection.items.push(item);
      return;
    }

    if (customSectionName) {
      const customSection: ContainerSection = (inventory[customSectionName] ??=
        {
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
}
