import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Item5e } from 'src/types/item.types';
import type { SpellbookSection } from 'src/types/types';

export class SheetSections {
  static get sectionProperty() {
    return 'section';
  }

  static get actionSectionProperty() {
    return 'actionSection';
  }

  static get sectionPropertyPath() {
    return `flags.${CONSTANTS.MODULE_ID}.${SheetSections.sectionProperty}`;
  }

  static get actionSectionPropertyPath() {
    return `flags.${CONSTANTS.MODULE_ID}.${SheetSections.actionSectionProperty}`;
  }

  static tryGetCustomSection(item: Item5e): string {
    return (
      FoundryAdapter.tryGetFlag<string>(
        item,
        SheetSections.sectionProperty
      )?.trim() ?? ''
    );
  }

  static tryGetCustomActionSection(item: Item5e): string {
    return (
      FoundryAdapter.tryGetFlag<string>(
        item,
        SheetSections.actionSectionProperty
      )?.trim() ?? ''
    );
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
      key: customSectionName,
      custom: {
        section: customSectionName,
        creationItemTypes: [CONSTANTS.ITEM_TYPE_SPELL],
      },

      ...options,
    });

    customSection.spells.push(spell);
  }

  static sortKeyedSections<T extends { key: string }>(
    sections: T[],
    keyOrder: string[] | undefined
  ) {
    if (!keyOrder) {
      return sections;
    }

    const maxLength = sections.length;
    const sortMap = new Map(keyOrder.map((e, i) => [e, i]));
    sections.sort(
      (a, b) =>
        (sortMap.get(a.key) ?? maxLength) - (sortMap.get(b.key) ?? maxLength)
    );

    return sections;
  }
}
