import { CONSTANTS } from 'src/constants';
import type { Item5e } from 'src/types/item.types';
import type { NpcAbilitySection } from 'src/types/types';
import { SheetSections } from './SheetSections';


export class NpcSheetSections {
  static get abilitiesItemTypes() {
    return [
      CONSTANTS.ITEM_TYPE_WEAPON,
      CONSTANTS.ITEM_TYPE_EQUIPMENT,
      CONSTANTS.ITEM_TYPE_TOOL,
      CONSTANTS.ITEM_TYPE_CONTAINER,
      CONSTANTS.ITEM_TYPE_LOOT,
      CONSTANTS.ITEM_TYPE_FEAT,
    ];
  }

  static applyAbilityToSection(
    abilities: Record<string, NpcAbilitySection>,
    feat: Item5e,
    customSectionOptions: Partial<NpcAbilitySection>
  ) {
    const customSectionName = SheetSections.tryGetCustomSection(feat);

    if (!customSectionName) {
      return;
    }

    const customSection: NpcAbilitySection = (abilities[customSectionName] ??= {
      label: customSectionName,
      items: [],
      hasActions: true,
      key: customSectionName,
      dataset: {
        [SheetSections.sectionPropertyPath]: customSectionName,
      },
      canCreate: true,
      custom: {
        section: customSectionName,
        creationItemTypes: NpcSheetSections.abilitiesItemTypes,
      },
      ...customSectionOptions,
    });

    customSection.items.push(feat);
  }
}
