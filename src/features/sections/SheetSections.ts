import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { Item5e } from 'src/types/item.types';
import type {
  ActionSectionClassic,
  Actor5e,
  ActorSheetContextV1,
  ActorSheetQuadroneContext,
  CharacterFeatureSection,
  CharacterSheetContext,
  CharacterSheetQuadroneContext,
  CustomSectionOptions,
  DraftAnimalSection,
  FavoriteSection,
  FeatureSection,
  GroupMemberSection,
  InventorySection,
  NpcAbilitySection,
  NpcSheetContext,
  NpcSheetQuadroneContext,
  SheetTabSection,
  SpellbookSection,
  SpellbookSectionLegacy,
  TidyItemSectionBase,
  TidySectionBase,
} from 'src/types/types';
import { isNil } from 'src/utils/data';
import type { SectionConfig } from './sections.types';
import { ItemUtils } from 'src/utils/ItemUtils';
import { UserSheetPreferencesService } from '../user-preferences/SheetPreferencesService';
import type { UserSheetPreference } from '../user-preferences/user-preferences.types';
import type { Activity5e, CharacterFavorite } from 'src/foundry/dnd5e.types';
import { error } from 'src/utils/logging';
import {
  getSortedActions,
  getSortedActionsQuadrone,
} from '../actions/actions.svelte';
import { SpellUtils } from 'src/utils/SpellUtils';
import { settings } from 'src/settings/settings.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import UserPreferencesService from '../user-preferences/UserPreferencesService';
import type { SpellcastingConfigEntry } from 'src/foundry/config.types';
import { Inventory } from './Inventory';

export class SheetSections {
  // TODO: To item sheet runtime with API support?
  static _itemCustomSectionDenylist = new Set<string>([
    CONSTANTS.ITEM_TYPE_BACKGROUND,
    CONSTANTS.ITEM_TYPE_CLASS,
    CONSTANTS.ITEM_TYPE_FACILITY,
    CONSTANTS.ITEM_TYPE_SUBCLASS,
    CONSTANTS.ITEM_TYPE_RACE,
  ]);

  static readonly EMPTY: TidySectionBase = Object.freeze({
    label: '',
    dataset: {},
    key: '',
    show: true,
    rowActions: [],
    sectionActions: [],
  });

  static itemSupportsCustomSections(itemType: string) {
    return !this._itemCustomSectionDenylist.has(itemType);
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

    section.items.push(spell);
  }

  static createSpellbookSection(
    customSectionName: string,
    options: Partial<SpellbookSection>
  ): SpellbookSection {
    return {
      type: CONSTANTS.SECTION_TYPE_SPELLBOOK,
      dataset: {
        [TidyFlags.section.prop]: customSectionName,
      },
      items: [],
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
      sectionActions: [], // for the UI Overhaul
      // TODO: Will something bad happen if I have an empty string on spellbook section .slot or .method?
      slot: '',
      method: '',
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
      | ActorSheetQuadroneContext,
    tabId: string,
    spells: Item5e[],
    options: Partial<SpellbookSection> = {},
    customSectionFlag: 'section' | 'actionSection' = 'section',
  ): SpellbookSection[] {
    const customSectionSpells = spells.filter((s) =>
      TidyFlags[customSectionFlag].get(s),
    );
    spells = spells.filter((s) => !TidyFlags.section.get(s));

    // TODO: Absorb _prepareSpellbookLegacy
    const spellbook: SpellbookSection[] = this._prepareSpellbookLegacy(
      context,
      spells
    ).map(
      (s: SpellbookSectionLegacy) =>
        ({
          ...s,
          type: CONSTANTS.SECTION_TYPE_SPELLBOOK,
          uses: Number.isNumeric(s.uses) ? +s.uses : undefined,
          slots: Number.isNumeric(s.slots) ? +s.slots : undefined,
          key: s.slot,
          method: s.id,
          show: true,
          rowActions: options.rowActions ?? [], // for the UI Overhaul
          sectionActions: options.sectionActions ?? [], // for the UI Overhaul
        }) satisfies SpellbookSection
    );

    const spellbookMap = spellbook.reduce<Record<string, SpellbookSection>>(
      (prev, curr) => {
        let key = curr.slot ?? '';
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
   * @param context    Sheet rendering context data being prepared for render.
   * @param items      Spells to be included in the spellbook.
   * @returns          Spellbook sections in the proper order.
   * @protected
   */
  static _prepareSpellbookLegacy(
    context: ActorSheetContextV1 | ActorSheetQuadroneContext,
    items: Item5e[]
  ) {
    const owner = context.actor.isOwner;
    const spellbook: Record<string, SpellbookSectionLegacy> = {};
    const castActivitySpellGroupingPreference =
      UserPreferencesService.get()?.castActivitySpellGrouping ??
      CONSTANTS.SPELL_CAST_ACTIVITY_GROUPING_ADDITIONAL;

    /** Register a section in the spellbook */
    const registerSection = (
      key: string,
      level?: number,
      config?: SpellcastingConfigEntry,
      customLabel?: string
    ) => {
      level = config?.slots ? level : 1;

      if (key in spellbook) {
        return;
      }

      const label =
        customLabel ??
        config?.getLabel({ level }) ??
        game.i18n.localize('DND5E.CAST.SECTIONS.Spellbook');
      const method = config?.key ?? key;
      const order = level === 0 ? 0 : (config?.order ?? 1000);
      const usesSlots = config?.slots && level;

      const spells = foundry.utils.getProperty(
        context.actor.system.spells,
        key
      );

      let slotsData = {};

      if (usesSlots) {
        slotsData = {
          uses: spells.value ?? 0,
          slots: spells.override ?? spells.max ?? 0,
        };
      }

      spellbook[key] = {
        label,
        order,
        usesSlots: !!usesSlots,
        id: method,
        canCreate: owner,
        canPrepare: !!config?.prepares,
        items: [],
        dataset: {
          type: 'spell',
          ['system.level']: level,
          ['system.method']: method,
        },
        slot: key,
        editable: context.editable,
        ...slotsData,
      };
    };

    // Register sections for the available spellcasting methods this character has.
    for (const spellcasting of Object.values(CONFIG.DND5E.spellcasting)) {
      const levels = spellcasting.getAvailableLevels?.(context.actor) ?? [];

      if (!levels.length) continue;
      if (!spellcasting.getSpellSlotKey) continue;

      if (spellcasting.cantrips)
        registerSection('spell0', 0, CONFIG.DND5E.spellcasting.spell);
      levels.forEach((l) =>
        registerSection(spellcasting.getSpellSlotKey!(l), l, spellcasting)
      );
    }

    // Iterate over every spell item, adding spells to the spellbook by section
    items.forEach((spell: Item5e) => {
      let method = spell.system.method as keyof CONFIG['DND5E']['spellcasting'];

      if (!(method in CONFIG.DND5E.spellcasting)) {
        method = 'innate'; // TODO: Constant
      }

      const spellcasting = CONFIG.DND5E.spellcasting[method];
      const level = spell.system.level || 0;
      method = spellcasting?.getSpellSlotKey?.(level) ?? method;
      let key: string = method;

      // Spells from items
      if (spell.system.linkedActivity) {
        if (!spell.system.linkedActivity?.displayInSpellbook) return;

        let label = '';
        key = method;

        if (
          castActivitySpellGroupingPreference ===
          CONSTANTS.SPELL_CAST_ACTIVITY_GROUPING_ADDITIONAL
        ) {
          key = 'dnd5e-cast-activity-additional-spells';
          label = game.i18n.localize('DND5E.CAST.SECTIONS.Spellbook');
        } else if (
          castActivitySpellGroupingPreference ===
          CONSTANTS.SPELL_CAST_ACTIVITY_GROUPING_PER_ITEM
        ) {
          key = spell.system.linkedActivity.item.uuid
            .slugify()
            // UUIDs contain dots, and dots cause hierarchical data saving, which messes up section config.
            .replaceAll('.', '-');
          label = spell.system.linkedActivity.item.name;
        }

        if (!spellbook[key]) {
          // TODO: Clean this up with an options object
          registerSection(key, undefined, undefined, label);
          spellbook[key].order = 1000;
        }
      }

      // Sections for higher-level spells which the caster does not have any slots for.
      else {
        registerSection(method, level, spellcasting);
      }

      // Add the spell to the relevant heading
      spellbook[key].items.push(spell);
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
    context:
      | CharacterSheetContext
      | NpcSheetContext
      | CharacterSheetQuadroneContext
      | NpcSheetQuadroneContext,
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

  static configureVehicleStatblockSections(
    sections: (InventorySection | DraftAnimalSection)[],
    tabId: string,
    sheetPreferences: UserSheetPreference,
    sectionConfig?: Record<string, SectionConfig>
  ) {
    sections = SheetSections.sortKeyedSections(sections, sectionConfig);

    const sortMode = sheetPreferences.tabs?.[tabId]?.sort ?? 'm';

    return sections.map(({ ...section }) => {
      if (section.type === 'inventory') {
        section.items = ItemUtils.getSortedItems(section.items, sortMode);
      } else if (
        section.type === CONSTANTS.SECTION_TYPE_DRAFT_ANIMALS &&
        (
          [
            CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_ASCENDING,
            CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_DESCENDING,
          ] as string[]
        ).includes(sortMode)
      ) {
        // TODO: Figure out how to generically support sorting for a mixture of different document types and subtypes.
        ItemUtils.sortItems(section.members, sortMode);
      }

      // Apply visibility from configuration
      section.show = sectionConfig?.[section.key]?.show !== false;

      return section;
    });
  }

  static configureInventory(
    sections: InventorySection[],
    tabId: string,
    sheetPreferences: UserSheetPreference,
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

      const characterPreferences = UserSheetPreferencesService.getByType(
        document.type
      );

      const sortMode = characterPreferences.tabs?.[tabId]?.sort ?? 'm';

      return sections.map(({ ...section }) => {
        // Filter Spellbook by Class Filter, if needed
        section.items = SpellUtils.tryFilterByClass(
          document,
          section.items,
          spellClassFilter
        );

        // Sort Spellbook
        section.items = ItemUtils.getSortedItems(section.items, sortMode);

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
    sheetPreferences: UserSheetPreference,
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
            let items = section.items;
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
              section.items = items;
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

  static configureStatblock<TSection extends FeatureSection | SpellbookSection>(
    sections: TSection[],
    context: NpcSheetQuadroneContext,
    tabId: string,
    sheetPreferences: UserSheetPreference,
    sectionConfig?: Record<string, SectionConfig>
  ) {
    try {
      sections = SheetSections.sortKeyedSections(sections, sectionConfig);

      const sortMode = sheetPreferences.tabs?.[tabId]?.sort ?? 'm';

      return sections.map(({ ...section }) => {
        // Sort Statblock entries
        section.items = ItemUtils.getSortedItems(section.items, sortMode);

        // Apply visibility from configuration
        section.show = sectionConfig?.[section.key]?.show !== false;

        return section;
      });
    } catch (e) {
      error('An error occurred while configuring features', false, e);
    }

    return sections;
  }

  static configureFeatures<
    TSection extends
      | CharacterFeatureSection
      | FeatureSection
      | NpcAbilitySection
  >(
    features: TSection[],
    context:
      | CharacterSheetContext
      | NpcSheetContext
      | CharacterSheetQuadroneContext
      | NpcSheetQuadroneContext,
    tabId: string,
    sheetPreferences: UserSheetPreference,
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
    sections: ActionSectionClassic[],
    tabId: string,
    sheetPreferences: UserSheetPreference,
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

  static configureActionsQuadrone<T extends TidyItemSectionBase>(
    sections: T[],
    tabId: string,
    sheetPreferences: UserSheetPreference,
    sectionConfigs: Record<string, SectionConfig> | undefined
  ) {
    try {
      sections = SheetSections.sortKeyedSections(sections, sectionConfigs);

      const sortMode = sheetPreferences.tabs?.[tabId]?.sort ?? 'm';

      return sections.map(({ ...section }) => {
        section.items = getSortedActionsQuadrone(section, sortMode);

        section.show = sectionConfigs?.[section.key]?.show !== false;

        return section;
      });
    } catch (e) {
      error('An error occurred while configuring actions', false, e);
    }

    return sections;
  }

  static getKnownCustomItemSections(document: any) {
    const useParentCollection =
      !!document.parent && !FoundryAdapter.isLockedInCompendium(document);

    const itemCollection = useParentCollection
      ? document.parent.items
      : game.items;

    const sectionSet: Set<string> = itemCollection.reduce(
      (prev: Item5e, curr: Item5e) => {
        prev.add(TidyFlags.section.get(curr));
        prev.add(TidyFlags.actionSection.get(curr));
        return prev;
      },
      new Set<string>()
    );

    settings.value.globalCustomSections.forEach((defaultSectionConfig) =>
      sectionSet.add(defaultSectionConfig.section)
    );

    return Array.from<string>(sectionSet)
      .filter((x) => !isNil(x, ''))
      .toSorted((left, right) => left.localeCompare(right, game.i18n.lang));
  }

  static getKnownCustomGroupMemberSections(group: Actor5e) {
    const sectionSet = new Set<string>(
      Object.values(TidyFlags.sections.get(group)).filter((s) => !isNil(s))
    );

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

  static getSectionLabel(item: Item5e) {
    let value = Inventory.isItemInventoryType(item)
      ? 'DND5E.Inventory'
      : item.parent?.type === CONSTANTS.SHEET_TYPE_NPC &&
        item.type === CONSTANTS.ITEM_TYPE_FEAT
      ? 'TIDY5E.StatblockTabName'
      : item.type === CONSTANTS.ITEM_TYPE_FEAT
      ? 'DND5E.Features'
      : item.type === CONSTANTS.ITEM_TYPE_SPELL
      ? 'DND5E.Spellbook'
      : 'TIDY5E.Section.Label';

    return FoundryAdapter.localize(value);
  }

  static getActionSectionLabel(item: Item5e) {
    return item.parent?.type === CONSTANTS.SHEET_TYPE_CHARACTER
      ? FoundryAdapter.localize('Sheet')
      : FoundryAdapter.localize('TIDY5E.Actions.TabName');
  }

  // TODO: Consider just moving this to the sheet class now that there's no classic sheet equivalent.
  static configureGroupMembers(
    sections: GroupMemberSection[],
    tabId: string,
    sheetPreferences: UserSheetPreference,
    sectionConfigs: Record<string, SectionConfig> | undefined
  ) {
    try {
      sections = SheetSections.sortKeyedSections(sections, sectionConfigs);

      const sortMode = sheetPreferences.tabs?.[tabId]?.sort ?? 'm';

      return sections.map(({ ...section }) => {
        // Sort - Group members are natively manually sorted
        if (sortMode !== 'm') {
          // TODO: This doesn't work because of the member data shape.
          // Will need to find a way to punch through the item for comparison
          // while still sorting the main entry.
          // section.members = ItemUtils.getSortedItems(section.members, sortMode);
        }

        // Apply visibility from configuration
        section.show = sectionConfigs?.[section.key]?.show !== false;

        return section;
      });
    } catch (e) {
      error('An error occurred while configuring group members', false, e);
    }

    return sections;
  }

  static showInFeatures(item: Item5e) {
    return (
      !item.type.includes([
        CONSTANTS.ITEM_TYPE_CONTAINER,
        CONSTANTS.ITEM_TYPE_SPELL,
        CONSTANTS.ITEM_TYPE_BACKGROUND,
        CONSTANTS.ITEM_TYPE_CLASS,
        CONSTANTS.ITEM_TYPE_SUBCLASS,
        CONSTANTS.ITEM_TYPE_RACE,
        CONSTANTS.ITEM_TYPE_FACILITY,
      ]) && !Inventory.isItemInventoryType(item)
    );
  }
}
