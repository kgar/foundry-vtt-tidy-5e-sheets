import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Item5e } from 'src/types/item.types';
import type {
  CharacterFeatureSection,
  InventorySection,
  SpellbookSection,
} from 'src/types/types';

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

  static applyCharacterFeatureToSection(
    features: Record<string, CharacterFeatureSection>,
    feat: Item5e,
    customSectionOptions: Partial<CharacterFeatureSection>
  ) {
    const customSectionName = SheetSections.tryGetCustomSection(feat);

    if (!customSectionName) {
      return;
    }

    const customSection: CharacterFeatureSection = (features[
      customSectionName
    ] ??= {
      label: customSectionName,
      items: [],
      hasActions: true,
      dataset: {
        [SheetSections.sectionPropertyPath]: customSectionName,
        type: CONSTANTS.ITEM_TYPE_FEAT,
      },
      isClass: false,
      canCreate: true,
      showUsesColumn: true,
      showUsagesColumn: true,
      showRequirementsColumn: true,
      custom: {
        creationItemTypes: [CONSTANTS.ITEM_TYPE_FEAT],
      },
      ...customSectionOptions,
    });

    customSection.items.push(feat);
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

  static generateCustomSpellbookSections(
    spells: Item5e[],
    options: Partial<SpellbookSection>
  ) {
    const customSpellbook: Record<string, SpellbookSection> = {};
    spells.forEach((s) =>
      SheetSections.applySpellToSection(customSpellbook, s, options)
    );
    return Object.values(customSpellbook);
  }

  static applySpellToSection(
    spellbook: Record<string, SpellbookSection>,
    spell: Item5e,
    options: Partial<SpellbookSection>
  ) {
    const customSectionName = SheetSections.tryGetCustomSection(spell);

    if (!customSectionName) {
      // TODO: Eventually absorb core spellbook section prep to this service
      return;
    }

    const customSection: SpellbookSection = (spellbook[customSectionName] ??= {
      dataset: { [SheetSections.sectionPropertyPath]: customSectionName },
      spells: [],
      label: customSectionName,
      canCreate: true,
      canPrepare: true,
      usesSlots: false,
      custom: {
        creationItemTypes: [CONSTANTS.ITEM_TYPE_SPELL],
      },

      ...options,
    });

    customSection.spells.push(spell);
  }
}
