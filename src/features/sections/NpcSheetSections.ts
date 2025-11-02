import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { Item5e } from 'src/types/item.types';
import type { NpcAbilitySection } from 'src/types/types';

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
    const customSectionName = TidyFlags.section.get(feat);

    if (!customSectionName) {
      return;
    }

    const customSection: NpcAbilitySection = (abilities[customSectionName] ??=
      NpcSheetSections.createFeatureSection(
        customSectionName,
        customSectionOptions
      ));

    customSection.items.push(feat);
  }

  static createFeatureSection(
    customSectionName: string,
    customSectionOptions: Partial<NpcAbilitySection>
  ): NpcAbilitySection {
    return {
      type: CONSTANTS.SECTION_TYPE_FEATURE,
      label: customSectionName,
      items: [],
      hasActions: true,
      key: customSectionName,
      dataset: {
        [TidyFlags.section.prop]: customSectionName,
      },
      canCreate: true,
      custom: {
        section: customSectionName,
        creationItemTypes: NpcSheetSections.abilitiesItemTypes,
      },
      show: true,
      rowActions: [], // for the UI Overhaul
      headerActions: [], // for the UI Overhaul
      ...customSectionOptions,
    };
  }
}
