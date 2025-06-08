import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { Item5e } from 'src/types/item.types';
import type {
  ActionSection,
  Actor5e,
  ActorSheetContextV1,
  ActorSheetQuadroneContext,
  CharacterFeatureSection,
  CharacterSheetContext,
  CharacterSheetQuadroneContext,
  CustomSectionOptions,
  FavoriteSection,
  FeatureSection,
  InventorySection,
  NpcAbilitySection,
  NpcSheetContext,
  NpcSheetQuadroneContext,
  SpellbookSection,
  SpellbookSectionLegacy,
  TidySectionBase,
} from 'src/types/types';
import { isNil } from 'src/utils/data';
import type { SectionConfig } from './sections.types';
import { ItemUtils } from 'src/utils/ItemUtils';
import { SheetPreferencesService } from '../user-preferences/SheetPreferencesService';
import type { SheetPreference } from '../user-preferences/user-preferences.types';
import type { Activity5e, CharacterFavorite } from 'src/foundry/dnd5e.types';
import { error } from 'src/utils/logging';
import { getSortedActions } from '../actions/actions.svelte';
import { SpellUtils } from 'src/utils/SpellUtils';
import { settings } from 'src/settings/settings.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export class SheetSections {
  // TODO: To item sheet runtime with API support?
  static _itemCustomSectionBlacklist = new Set<string>([
    CONSTANTS.ITEM_TYPE_BACKGROUND,
    CONSTANTS.ITEM_TYPE_CLASS,
    CONSTANTS.ITEM_TYPE_FACILITY,
    CONSTANTS.ITEM_TYPE_SUBCLASS,
    CONSTANTS.ITEM_TYPE_RACE,
  ]);

  static itemSupportsCustomSections(itemType: string) {
    return !this._itemCustomSectionBlacklist.has(itemType);
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

    const section: SpellbookSection = (spellbook[customSectionName] ??=
      SheetSections.createSpellbookSection(customSectionName, options));

    section.spells.push(spell);
  }

  static createSpellbookSection(
    customSectionName: string,
    options: Partial<SpellbookSection>
  ): SpellbookSection {
    return {
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
      rowActions: [], // for the UI Overhaul
      ...options,
    };
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

    return sections.toSorted(
      (a, b) =>
        (sortMap.get(a.key) ?? defaultSortMap.get(a.key) ?? maxLength) -
        (sortMap.get(b.key) ?? defaultSortMap.get(b.key) ?? maxLength)
    );
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

    var sortedCustomSections = customSections.toSorted((a, b) =>
      a.localeCompare(b, game.i18n.lang)
    );

    return [...defaultSections, ...sortedCustomSections];
  }

  // TODO: Fold into legacy?
  static prepareTidySpellbook(
    context:
      | CharacterSheetContext
      | NpcSheetContext
      | CharacterSheetQuadroneContext
      | NpcSheetQuadroneContext,
    tabId: string,
    spells: Item5e[],
    options: Partial<SpellbookSection> = {}
  ): SpellbookSection[] {
    const customSectionSpells = spells.filter((s) => TidyFlags.section.get(s));
    spells = spells.filter((s) => !TidyFlags.section.get(s));

    // TODO: Absorb _prepareSpellbookLegacy
    const spellbook: SpellbookSection[] = this._prepareSpellbookLegacy(
      context,
      spells
    ).map(
      (s: SpellbookSectionLegacy) =>
        ({
          ...s,
          uses: Number.isNumeric(s.uses) ? +s.uses : undefined,
          slots: Number.isNumeric(s.slots) ? +s.slots : undefined,
          key: s.prop,
          show: true,
          rowActions: options.rowActions ?? [], // for the UI Overhaul
        } satisfies SpellbookSection)
    );

    const spellbookMap = spellbook.reduce<Record<string, SpellbookSection>>(
      (prev, curr) => {
        let key = curr.prop ?? '';

        // Handle "Additional Spells" section
        if (curr.dataset.level === 'item') {
          key = 'dnd5e-cast-activity-additional-spells';
          curr.canCreate = false;
        }

        curr.key = key;

        prev[key] = curr;
        return prev;
      },
      {}
    );

    customSectionSpells.forEach((spell) => {
      SheetSections.applySpellToSection(spellbookMap, spell, options);
    });

    SheetSections.getFilteredGlobalSectionsToShowWhenEmpty(
      context.actor,
      tabId
    ).forEach((s) => {
      spellbookMap[s] ??= SheetSections.createSpellbookSection(s, {
        canCreate: true,
        ...options,
      });
    });

    return Object.values(spellbookMap);
  }

  /**
   * Insert a spell into the spellbook object when rendering the character sheet.
   * @param {object} context    Sheet rendering context data being prepared for render.
   * @param {object[]} spells   Spells to be included in the spellbook.
   * @returns {object[]}        Spellbook sections in the proper order.
   * @protected
   */
  static _prepareSpellbookLegacy(
    context: ActorSheetContextV1 | ActorSheetQuadroneContext,
    spells: Item5e
  ) {
    const owner = context.actor.isOwner;
    const levels = context.actor.system.spells;
    const spellbook: Record<string, SpellbookSectionLegacy> = {};

    // Define section and label mappings
    const sections = Object.entries(CONFIG.DND5E.spellPreparationModes).reduce<
      Record<string, any>
    >((acc, [k, spell]) => {
      if ('order' in spell && Number.isNumeric(spell.order)) {
        acc[k] = Number(spell.order);
      }
      return acc;
    }, {});
    const useLabels: Record<string, string | number> = {
      '-30': '-',
      '-20': '-',
      '-10': '-',
      0: '&infin;',
    };

    type SpellSectionPrepArgs = {
      prepMode?: string;
      value?: number;
      max?: number;
      override?: number;
      config?: (typeof CONFIG.DND5E.spellPreparationModes)[0];
      levels?: any;
    };

    // Format a spellbook entry for a certain indexed level
    const registerSection = (
      sl: string,
      i: number,
      label: string,
      {
        prepMode = 'prepared',
        value,
        max,
        override,
        config,
      }: SpellSectionPrepArgs = {}
    ) => {
      const aeOverride = foundry.utils.hasProperty(
        context.actor.overrides,
        `system.spells.spell${i}.override`
      );
      spellbook[i] = {
        order: i,
        label: label,
        usesSlots: i > 0,
        canCreate: owner,
        canPrepare:
          (context.actor.type === 'character' && i >= 1) || !!config?.prepares,
        spells: [],
        uses: useLabels[i] || value || 0,
        slots: useLabels[i] || max || 0,
        override: override || 0,
        dataset: {
          type: 'spell',
          ['system.level']: prepMode in sections ? 1 : i,
          ['system.preparation.mode']: prepMode,
        },
        prop: sl,
        editable: context.editable && !aeOverride,
      };
    };

    // Determine the maximum spell level which has a slot
    const maxLevel = Array.fromRange(
      Object.keys(CONFIG.DND5E.spellLevels).length - 1,
      1
    ).reduce((max, i) => {
      const level = levels[`spell${i}`];
      if (level && (level.max || level.override) && i > max) max = i;
      return max;
    }, 0);

    // Level-based spellcasters have cantrips and leveled slots
    if (maxLevel > 0) {
      registerSection('spell0', 0, CONFIG.DND5E.spellLevels[0]);
      for (let lvl = 1; lvl <= maxLevel; lvl++) {
        const sl = `spell${lvl}`;
        registerSection(sl, lvl, CONFIG.DND5E.spellLevels[lvl], levels[sl]);
      }
    }

    // Create spellbook sections for all alternative spell preparation modes that have spell slots.
    for (const [k, v] of Object.entries(CONFIG.DND5E.spellPreparationModes)) {
      let upcast = 'upcast' in v && v.upcast;

      if (!(k in levels) || !upcast || !levels[k].max) {
        continue;
      }

      let cantrips = 'cantrips' in v && v.cantrips;
      if (!spellbook['0'] && cantrips) {
        registerSection('spell0', 0, CONFIG.DND5E.spellLevels[0]);
      }

      const l = levels[k];

      const level = game.i18n.localize(`DND5E.SpellLevel${l.level}`);

      const label = `${v.label} — ${level}`;

      registerSection(k, sections[k], label, {
        prepMode: k,
        value: l.value,
        max: l.max,
        override: l.override,
        config: v,
      });
    }

    // Iterate over every spell item, adding spells to the spellbook by section
    spells.forEach((spell: Item5e) => {
      const mode = spell.system.preparation.mode || 'prepared';
      let s = spell.system.level || 0;
      const sl = `spell${s}`;

      // Spells from items
      if (spell.getFlag('dnd5e', 'cachedFor')) {
        s = 'item';
        if (!spell.system.linkedActivity?.displayInSpellbook) return;
        if (!spellbook[s]) {
          registerSection(
            'dnd5e-cast-activity-additional-spells',
            s,
            game.i18n.localize('DND5E.CAST.SECTIONS.Spellbook')
          );
          spellbook[s].order = 1000;
        }
      }

      // Specialized spellcasting modes (if they exist)
      else if (mode in sections) {
        s = sections[mode];
        if (!spellbook[s]) {
          const l = levels[mode] || {};
          const config = CONFIG.DND5E.spellPreparationModes[mode];
          registerSection(mode, s, config.label, {
            prepMode: mode,
            value: l.value,
            max: l.max,
            override: l.override,
            config: config,
          });
        }
      }

      // Sections for higher-level spells which the caster "should not" have, but spell items exist for
      else if (!spellbook[s]) {
        registerSection(sl, s, CONFIG.DND5E.spellLevels[s], {
          // TODO: Investigate this. It seems unused.
          levels: levels[sl],
        });
      }

      // Add the spell to the relevant heading
      spellbook[s].spells.push(spell);
    });

    // Sort the spellbook by section level
    const sorted = Object.values(spellbook);
    sorted.sort((a, b) => a.order - b.order);
    return sorted;
  }

  static prepareClassItems(
    context:
      | CharacterSheetContext
      | NpcSheetContext
      | CharacterSheetQuadroneContext
      | NpcSheetQuadroneContext,
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

      return sections.map(({ ...section }) => {
        section.items = ItemUtils.getSortedItems(section.items, sortMode);

        // Apply visibility from configuration
        section.show = sectionConfig?.[section.key]?.show !== false;

        return section;
      });
    } catch (e) {
      error('An error occurred while configuring inventory', false, e);
    }

    return sections;
  }

  static configureSpellbook(
    document: any,
    tabId: string,
    sections: SpellbookSection[],
    spellClassFilter: string = ''
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

      return sections.map(({ ...section }) => {
        // Filter Spellbook by Class Filter, if needed
        section.spells = SpellUtils.tryFilterByClass(
          document,
          section.spells,
          spellClassFilter
        );

        // Sort Spellbook
        section.spells = ItemUtils.getSortedItems(section.spells, sortMode);

        // TODO: Collocate Spellbook Sub Items

        // Apply visibility from configuration
        section.show =
          sectionConfigs?.[CONSTANTS.TAB_ACTOR_SPELLBOOK]?.[section.key]
            ?.show !== false;

        return section;
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
    let configuredFavorites: FavoriteSection[] = [];

    try {
      configuredFavorites = SheetSections.sortKeyedSections(
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

      return (configuredFavorites as FavoriteSection[]).map(
        ({ ...section }) => {
          if ('effects' in section) {
            let effectContexts = section.effects;

            // Sort Favorite Effects
            if (sortMode === 'm') {
              const getSort = (effects: Item5e) =>
                favoritesIdMap.get(effects.getRelativeUUID(actor))?.sort ??
                Number.MAX_SAFE_INTEGER;

              effectContexts = effectContexts.toSorted(
                (a, b) => getSort(a.effect) - getSort(b.effect)
              );
            } else {
              effectContexts = effectContexts.toSorted((a, b) =>
                a.effect.name.localeCompare(b.effect.name, game.i18n.lang)
              );
            }

            // TODO: Filter Favorite Effects ?
          } else if ('activities' in section) {
            let activities = section.activities;

            // Sort Favorite Activities
            if (sortMode === 'm') {
              const getSort = (activity: Activity5e) =>
                favoritesIdMap.get(activity.relativeUUID)?.sort ??
                Number.MAX_SAFE_INTEGER;

              activities = activities.toSorted(
                (a, b) => getSort(a) - getSort(b)
              );
            } else {
              activities = activities.toSorted((a, b) =>
                a.name.localeCompare(b.name, game.i18n.lang)
              );
            }

            // TODO: Filter Favorite Activities?
          } else {
            let items = 'spells' in section ? section.spells : section.items;
            // Sort Favorites Items
            if (sortMode === 'm') {
              const getSort = (item: Item5e) =>
                favoritesIdMap.get(item.getRelativeUUID(actor))?.sort ??
                Number.MAX_SAFE_INTEGER;

              items = items.toSorted((a, b) => getSort(a) - getSort(b));
            } else {
              items = ItemUtils.getSortedItems(items, sortMode);
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

          return section;
        }
      );
    } catch (e) {
      error('An error occurred while configuring favorites', false, e);
    }

    return configuredFavorites;
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

      return features.map(({ ...section }) => {
        // Sort Features
        section.items = ItemUtils.getSortedItems(section.items, sortMode);

        // Collocate Feature Sub Items
        section.items = SheetSections.collocateSubItems(context, section.items);

        // Apply visibility from configuration
        section.show = sectionConfig?.[section.key]?.show !== false;

        return section;
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

      return sections.map(({ ...section }) => {
        section.actions = getSortedActions(section, sortMode);

        section.show = sectionConfigs?.[section.key]?.show !== false;

        return section;
      });
    } catch (e) {
      error('An error occurred while configuring actions', false, e);
    }

    return sections;
  }

  static getKnownCustomSections(document: any) {
    const useParentCollection =
      !!document.parent && !FoundryAdapter.isLockedInCompendium(document);

    const itemCollection = useParentCollection
      ? document.parent.items
      : game.items;

    const sectionSet = itemCollection.reduce((prev: Item5e, curr: Item5e) => {
      prev.add(TidyFlags.section.get(curr));
      prev.add(TidyFlags.actionSection.get(curr));
      return prev;
    }, new Set<string>());

    settings.value.globalCustomSections.forEach((defaultSectionConfig) =>
      sectionSet.add(defaultSectionConfig.section)
    );

    return Array.from<string>(sectionSet)
      .filter((x) => !isNil(x, ''))
      .toSorted((left, right) => left.localeCompare(right, game.i18n.lang));
  }

  static getFilteredGlobalSectionsToShowWhenEmpty(
    document: any,
    tabId: string
  ) {
    const sheetType = document.type;
    return settings.value.globalCustomSections
      .filter((x) => {
        if (!x.showWhenEmpty) {
          return false;
        }

        const isUnfiltered =
          Object.entries(x.showWhenEmptyFilters).length === 0;

        if (isUnfiltered) {
          return true;
        }

        const filters = x.showWhenEmptyFilters[sheetType];
        const sheetTypeIsIncluded = filters !== undefined;

        return (
          sheetTypeIsIncluded &&
          (filters.length === 0 || filters.includes(tabId))
        );
      })
      .map((x) => x.section);
  }
}
