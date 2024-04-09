import { TidyFlags } from 'src/api';
import { CONSTANTS } from 'src/constants';
import type { Tidy5eCharacterSheet } from 'src/sheets/Tidy5eCharacterSheet';
import type { Tidy5eNpcSheet } from 'src/sheets/Tidy5eNpcSheet';
import type { Item5e } from 'src/types/item.types';
import type {
  Actor5e,
  CharacterSheetContext,
  CustomSectionOptions,
  NpcSheetContext,
  SpellbookSection,
} from 'src/types/types';

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

    const section: SpellbookSection = (spellbook[customSectionName] ??= {
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

    section.spells.push(spell);
  }

  static sortKeyedSections<
    T extends { key: string; custom?: CustomSectionOptions }
  >(sections: T[], keyOrder: string[] | undefined) {
    const sortMap = new Map((keyOrder ?? []).map((e, i) => [e, i]));
    const defaultSortMap = new Map(
      SheetSections.getDefaultSortOrder(sections).map((e, i) => [e, i])
    );

    const maxLength = sections.length;
    sections.sort(
      (a, b) =>
        (sortMap.get(a.key) ?? defaultSortMap.get(a.key) ?? maxLength) -
        (sortMap.get(b.key) ?? defaultSortMap.get(b.key) ?? maxLength)
    );

    return sections;
  }

  static getDefaultSortOrder<
    T extends { key: string; custom?: CustomSectionOptions }
  >(sections: T[]): string[] {
    const { defaultSections, customSections } = sections.reduce<{
      defaultSections: string[];
      customSections: string[];
    }>(
      (prev, curr) => {
        curr.custom
          ? prev.customSections.push(curr.key)
          : prev.defaultSections.push(curr.key);

        return prev;
      },
      { defaultSections: [], customSections: [] }
    );

    customSections.sort((a, b) => a.localeCompare(b));

    return [...defaultSections, ...customSections];
  }

  static prepareTidySpellbook(
    context: CharacterSheetContext | NpcSheetContext,
    spells: Item5e[],
    options: Partial<SpellbookSection> = {},
    app: Tidy5eCharacterSheet | Tidy5eNpcSheet
  ): SpellbookSection[] {
    const customSectionSpells = spells.filter((s) => TidyFlags.section.get(s));
    spells = spells.filter((s) => !TidyFlags.section.get(s));

    const spellbook: SpellbookSection[] = app
      ._prepareSpellbook(context, spells)
      .map((s: SpellbookSection) => ({
        ...s,
        key: s.key ?? s.prop,
      }));

    const spellbookMap = spellbook.reduce<Record<string, SpellbookSection>>(
      (prev, curr) => {
        const key = curr.prop ?? '';
        curr.key = key;
        prev[key] = curr;
        return prev;
      },
      {}
    );

    customSectionSpells.forEach((spell) => {
      SheetSections.applySpellToSection(spellbookMap, spell, options);
    });

    return spellbook;
  }

  static prepareClassItems(
    context: CharacterSheetContext | NpcSheetContext,
    classes: Item5e[],
    subclasses: Item5e[],
    actor: Actor5e
  ) {
    const maxLevelDelta = CONFIG.DND5E.maxLevel - actor.system.details.level;
    return classes.reduce((arr, cls) => {
      arr.push(cls);
      const ctx = (context.itemContext[cls.id] ??= {});
      ctx.availableLevels = Array.fromRange(CONFIG.DND5E.maxLevel + 1)
        .slice(1)
        .map((level) => {
          const delta = level - cls.system.levels;
          return { level, delta, disabled: delta > maxLevelDelta };
        });
      const identifier =
        cls.system.identifier || cls.name.slugify({ strict: true });
      const subclass = subclasses.findSplice(
        (s: Item5e) => s.system.classIdentifier === identifier
      );
      if (subclass) {
        arr.push(subclass);
        const subclassCtx = (context.itemContext[subclass.id] ??= {});
        subclassCtx.parent = cls;
      }
      return arr;
    }, []);
  }
}
