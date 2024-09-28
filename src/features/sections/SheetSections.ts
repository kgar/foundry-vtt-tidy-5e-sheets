import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { Tidy5eCharacterSheet } from 'src/sheets/classic/Tidy5eCharacterSheet';
import type { Tidy5eNpcSheet } from 'src/sheets/classic/Tidy5eNpcSheet';
import type { Item5e } from 'src/types/item.types';
import type {
  ActionSection,
  Actor5e,
  CharacterFeatureSection,
  CharacterSheetContext,
  CustomSectionOptions,
  FavoriteSection,
  FeatureSection,
  InventorySection,
  NpcAbilitySection,
  NpcSheetContext,
  SpellbookSection,
  TidySectionBase,
} from 'src/types/types';
import { isNil } from 'src/utils/data';
import type { SectionConfig } from './sections.types';
import { ItemUtils } from 'src/utils/ItemUtils';
import { SheetPreferencesService } from '../user-preferences/SheetPreferencesService';
import type { SheetPreference } from '../user-preferences/user-preferences.types';
import type { CharacterFavorite } from 'src/foundry/dnd5e.types';
import { error } from 'src/utils/logging';
import { sortActions } from '../actions/actions';

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
      show: true,
      ...options,
    });

    section.spells.push(spell);
  }

  static sortKeyedSections<
    T extends { key: string; custom?: CustomSectionOptions }
  >(sections: T[], sectionConfigs: Record<string, SectionConfig> | undefined) {
    const sortMap = new Map(
      Object.values(sectionConfigs ?? {}).map((e) => [e.key, e.order])
    );
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

    customSections.sort((a, b) => a.localeCompare(b, game.i18n.lang));

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
      .map(
        (s: SpellbookSection) =>
          ({
            ...s,
            key: s.key ?? s.prop,
            show: true,
          } satisfies SpellbookSection)
      );

    const spellbookMap = spellbook.reduce<Record<string, SpellbookSection>>(
      (prev, curr) => {
        const key = curr.prop ?? '';
        curr.key = key;

        // Tidy passes the dataset directly to the item creation code, rather than planting it on the HTML.
        // When Tidy fully takes over its own spellbook preparation, eliminate the need for this correcting patch.
        curr.dataset['system'] = {
          level: curr.dataset.level,
          preparationMode: curr.dataset.preparationMode,
        };
        delete curr.dataset.level;
        delete curr.dataset.preparationMode;

        prev[key] = curr;
        return prev;
      },
      {}
    );

    customSectionSpells.forEach((spell) => {
      SheetSections.applySpellToSection(spellbookMap, spell, options);
    });

    return Object.values(spellbookMap);
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
      } else {
        const subclassAdvancement = cls.advancement.byType.Subclass?.[0];
        if (
          subclassAdvancement &&
          subclassAdvancement.level <= cls.system.levels
        )
          ctx.needsSubclass = true;
      }
      return arr;
    }, []);
  }

  static collocateSubItems(
    context: CharacterSheetContext | NpcSheetContext,
    items: Item5e[]
  ): Item5e[] {
    const itemContext = context.itemContext;
    const { parents, parentIdToChildren } = items.reduce<{
      parents: Item5e[];
      parentIdToChildren: Map<string, Item5e[]>;
    }>(
      (prev, item) => {
        const parentItem = itemContext[item.id]?.parent;
        const isChild = !!parentItem;
        if (isChild) {
          const children = prev.parentIdToChildren.get(parentItem.id) ?? [];
          children.push(item);
          prev.parentIdToChildren.set(parentItem.id, children);
        } else {
          prev.parents.push(item);
        }
        return prev;
      },
      { parents: [], parentIdToChildren: new Map<string, Item5e[]>() }
    );

    if (parents.length === items.length) {
      return items;
    }

    return parents.reduce<Item5e[]>((result, item) => {
      result.push(item);

      const children = parentIdToChildren.get(item.id);

      if (children) {
        result.push(...children);
      }

      return result;
    }, []);
  }

  static accountForExternalSections(
    props: string[],
    data: Record<string, any>
  ) {
    props.forEach((prop) => {
      const sectionCollection = data[prop];
      sectionCollection?.forEach((section: any) => {
        if (!isNil(section.key)) {
          return;
        }

        section.key = SheetSections.getSectionKey(section);
        section.canCreate = false;
        section.show = true;
      });
    });
  }

  static getSectionKey(section: TidySectionBase) {
    if (isNil(section.key)) {
      return `${section.label}-external`;
    }

    return section.key;
  }

  static configureInventory(
    sections: InventorySection[],
    tabId: string,
    sheetPreferences: SheetPreference,
    sectionConfig?: Record<string, SectionConfig>
  ) {
    try {
      sections = SheetSections.sortKeyedSections(sections, sectionConfig);

      const sortMode = sheetPreferences.tabs?.[tabId]?.sort ?? 'm';

      sections.forEach((section) => {
        ItemUtils.sortItems(section.items, sortMode);

        // Apply visibility from configuration
        section.show = sectionConfig?.[section.key]?.show !== false;
      });
    } catch (e) {
      error('An error occurred while configuring inventory', false, e);
    }

    return sections;
  }

  static configureSpellbook(
    document: any,
    tabId: string,
    sections: SpellbookSection[]
  ) {
    try {
      const sectionConfigs = TidyFlags.sectionConfig.get(document);

      sections = SheetSections.sortKeyedSections(
        sections,
        sectionConfigs?.[tabId]
      );

      const characterPreferences = SheetPreferencesService.getByType(
        document.type
      );

      const sortMode = characterPreferences.tabs?.[tabId]?.sort ?? 'm';

      sections.forEach((section) => {
        // Sort Spellbook
        ItemUtils.sortItems(section.spells, sortMode);

        // TODO: Collocate Spellbook Sub Items

        // Apply visibility from configuration
        section.show =
          sectionConfigs?.[CONSTANTS.TAB_CHARACTER_SPELLBOOK]?.[section.key]
            ?.show !== false;
      });
    } catch (e) {
      error('An error occurred while configuring spells', false, e);
    }

    return sections;
  }

  static configureFavorites(
    favoriteSections: FavoriteSection[],
    actor: Actor5e,
    tabId: string,
    sheetPreferences: SheetPreference,
    sectionConfig?: Record<string, SectionConfig>
  ) {
    try {
      favoriteSections = SheetSections.sortKeyedSections(
        favoriteSections,
        sectionConfig
      );

      const sortMode = sheetPreferences.tabs?.[tabId]?.sort ?? 'm';

      const favoritesIdMap = actor.system.favorites.reduce(
        (map: Map<string, CharacterFavorite>, f: CharacterFavorite) => {
          map.set(f.id, f);
          return map;
        },
        new Map<string, CharacterFavorite>()
      );

      (favoriteSections as FavoriteSection[]).forEach((section) => {
        if ('effects' in section) {
          let effectContexts = section.effects;

          // Sort Favorite Effects
          if (sortMode === 'm') {
            const getSort = (effects: Item5e) =>
              favoritesIdMap.get(effects.getRelativeUUID(actor))?.sort ??
              Number.MAX_SAFE_INTEGER;

            effectContexts.sort(
              (a, b) => getSort(a.effect) - getSort(b.effect)
            );
          } else {
            effectContexts.sort((a, b) =>
              a.effect.name.localeCompare(b.effect.name, game.i18n.lang)
            );
          }

          // TODO: Filter Favorite Effects ?
        } else {
          let items = 'spells' in section ? section.spells : section.items;
          // Sort Favorites Items
          if (sortMode === 'm') {
            const getSort = (item: Item5e) =>
              favoritesIdMap.get(item.getRelativeUUID(actor))?.sort ??
              Number.MAX_SAFE_INTEGER;

            items.sort((a, b) => getSort(a) - getSort(b));
          } else {
            ItemUtils.sortItems(items, sortMode);
          }

          // TODO: Collocate Favorite Sub Items

          if ('spells' in section) {
            section.spells = items;
          } else {
            section.items = items;
          }
        }

        // Apply visibility from configuration
        section.show = sectionConfig?.[section.key]?.show !== false;
      });
    } catch (e) {
      error('An error occurred while configuring favorites', false, e);
    }

    return favoriteSections;
  }

  static configureFeatures<
    TSection extends
      | CharacterFeatureSection
      | FeatureSection
      | NpcAbilitySection
  >(
    features: TSection[],
    context: CharacterSheetContext | NpcSheetContext,
    tabId: string,
    sheetPreferences: SheetPreference,
    sectionConfig?: Record<string, SectionConfig>
  ): TSection[] {
    try {
      features = SheetSections.sortKeyedSections(features, sectionConfig);

      const sortMode = sheetPreferences.tabs?.[tabId]?.sort ?? 'm';

      features.forEach((section) => {
        // Sort Features
        ItemUtils.sortItems(section.items, sortMode);

        // Collocate Feature Sub Items
        section.items = SheetSections.collocateSubItems(context, section.items);

        // Apply visibility from configuration
        section.show = sectionConfig?.[section.key]?.show !== false;
      });
    } catch (e) {
      error('An error occurred while configuring features', false, e);
    }

    return features;
  }

  static configureActions(
    sections: ActionSection[],
    tabId: string,
    sheetPreferences: SheetPreference,
    sectionConfigs: Record<string, SectionConfig> | undefined
  ) {
    try {
      sections = SheetSections.sortKeyedSections(sections, sectionConfigs);

      const sortMode = sheetPreferences.tabs?.[tabId]?.sort ?? 'm';

      sections.forEach((section) => {
        sortActions(section, sortMode);

        section.show = sectionConfigs?.[section.key]?.show !== false;
      });
    } catch (e) {
      error('An error occurred while configuring actions', false, e);
    }

    return sections;
  }
}
