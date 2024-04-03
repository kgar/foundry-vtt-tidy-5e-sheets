import { TidyFlags } from 'src/api';
import { CONSTANTS } from 'src/constants';
import type { Item5e } from 'src/types/item.types';
import type { SpellbookSection } from 'src/types/types';

export class SheetSections {
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
    const customSectionName = TidyFlags.section.get(spell);

    if (!customSectionName) {
      // TODO: Eventually absorb core spellbook section prep to this service
      return;
    }

    const customSection: SpellbookSection = (spellbook[customSectionName] ??= {
      dataset: {
        [TidyFlags.section.prop]: customSectionName,
      },
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
