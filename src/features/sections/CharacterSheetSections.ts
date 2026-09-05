import { CONSTANTS } from 'src/constants';
import type { Item5e } from 'src/types/item.types';
import type {
  Actor5e,
  ActorInventoryTypes,
  TidyItemSectionBase,
  CharacterFeatureSection,
  CharacterItemPartitions,
  FavoriteSection,
  FeatureSection,
  EffectFavoriteSection,
  ActivitySection,
  CharacterSheetQuadroneContext,
} from 'src/types/types';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SheetSections } from './SheetSections';
import { isNil } from 'src/utils/data';
import { FeatureColumnRuntime } from 'src/runtime/table-columns/FeatureColumnRuntime';

export class CharacterSheetSections {
  static applyCharacterFeatureToSection(
    context: CharacterSheetQuadroneContext,
    tabId: string,
    features: Record<string, CharacterFeatureSection>,
    feat: Item5e,
    customSectionOptions: Partial<CharacterFeatureSection>,
  ) {
    const customSectionName = TidyFlags.section.get(feat);

    if (!customSectionName) {
      return;
    }

    const customSection: CharacterFeatureSection = (features[
      customSectionName
    ] ??= CharacterSheetSections.createFeatureSection(
      context,
      tabId,
      customSectionName,
      customSectionOptions,
    ));

    customSection.items.push(feat);
  }

  static createFeatureSection(
    context: CharacterSheetQuadroneContext,
    tabId: string,
    customSectionName: string,
    customSectionOptions: Partial<CharacterFeatureSection>,
  ): CharacterFeatureSection {
    return {
      type: CONSTANTS.SECTION_TYPE_FEATURE,
      label: customSectionName,
      items: [],
      hasActions: true,
      dataset: {
        [TidyFlags.section.prop]: customSectionName,
      },
      isClass: false,
      canCreate: true,
      showUsesColumn: true,
      showUsagesColumn: true,
      showFeatureTypeColumn: true,
      showRequirementsColumn: true,
      key: customSectionName,
      custom: {
        section: customSectionName,
        creationItemTypes: [CONSTANTS.ITEM_TYPE_FEAT],
      },
      show: true,
      sectionActions: [], // for the UI Overhaul
      columns: FeatureColumnRuntime.getColumnSpecifications({
        sheetDocument: context.document,
        tabId,
        sectionKey: customSectionName,
        editable: context.editable,
        owner: context.owner,
        unlocked: context.unlocked,
      }),
      ...customSectionOptions,
    };
  }

  static buildQuadroneFeatureSections(
    context: CharacterSheetQuadroneContext,
    tabId: string,
    feats: Item5e[],
    options: Partial<CharacterFeatureSection>,
  ): FeatureSection[] {
    let featuresMap: Record<string, FeatureSection> = {};

    function buildOriginKey(id: string) {
      return `tidy-feature-section-origin-${id}`;
    }

    function buildOriginSection(
      key: string,
      item: Item5e,
      options: Partial<CharacterFeatureSection>,
    ) {
      return CharacterSheetSections.createQuadroneFeatureSection({
        context,
        tabId,
        key,
        title: FoundryAdapter.localize('DND5E.FeaturesClass', {
          class: item.name,
        }),
        options: {
          ...options,
          dataset: {
            ...options.dataset,
            [CONSTANTS.SYSTEM_FLAG_PATH_ADVANCEMENT_ORIGIN]: `${item.id}.tidy-feature`,
          },
        },
      });
    }

    let otherFeaturesKey = 'tidy-feature-section-others';

    const otherFeaturesSection = this.createQuadroneFeatureSection({
      context,
      tabId,
      key: otherFeaturesKey,
      title: FoundryAdapter.localize('DND5E.FeaturesOther'),
      options,
    });

    for (let feat of feats) {
      // custom section
      let customSection = TidyFlags.section.get(feat);

      if (!isNil(customSection)) {
        // Partition/Create Custom Section and add item
        let section = (featuresMap[customSection] ??=
          this.createQuadroneFeatureSection({
            context,
            tabId,
            key: customSection,
            title: FoundryAdapter.localize(customSection),
            options,
            isCustom: true,
          }));

        section.items.push(feat);

        continue;
      }

      // partition origin feats
      const [originId] =
        feat
          .getFlag('dnd5e', CONSTANTS.SYSTEM_FLAG_ADVANCEMENT_ORIGIN)
          ?.split('.') ?? [];
      // get adv origin
      let originItem = context.actor.items.get(originId);

      if (originItem) {
        let key = buildOriginKey(originId);

        let section = featuresMap[key];

        if (!section) {
          section = featuresMap[key] = buildOriginSection(
            key,
            originItem,
            options,
          );
        }

        featuresMap[key].items.push(feat);

        continue;
      }

      let section = (featuresMap[otherFeaturesKey] ??= otherFeaturesSection);
      section.items.push(feat);
    }

    if (context.unlocked) {
      featuresMap[otherFeaturesKey] ??= otherFeaturesSection;

      Object.values(context.actor.classes)
        .concat(Object.values(context.actor.itemTypes.background))
        .concat(Object.values(context.actor.itemTypes.race))
        .concat(Object.values(context.actor.itemTypes.subclass))
        .forEach((originItem: Item5e) => {
          let key = buildOriginKey(originItem.id);
          featuresMap[key] ??= buildOriginSection(key, originItem, options);
        });
    }

    SheetSections.getFilteredGlobalSectionsToShowWhenEmpty(
      context.actor,
      tabId,
    ).forEach((s) => {
      featuresMap[s] ??= CharacterSheetSections.createQuadroneFeatureSection({
        context,
        tabId,
        key: s,
        options,
        title: FoundryAdapter.localize(s),
        isCustom: true,
      });
    });

    /*
      Do a prioritized sort:
      - Original Class / Subclass
      - Other Classes / Subclasses
      - Background
      - Species
      - Other
      - Custom Sections
    */

    let i = 0;

    let sectionSort: Record<string, number> = {};

    Object.values(context.actor.classes).forEach((cls: Item5e) => {
      let sortIndex = cls.system.isOriginalClass ? 0 : (i += 2);
      const clsKey = buildOriginKey(cls.id);
      sectionSort[clsKey] = sortIndex;

      if (cls.subclass) {
        const subKey = buildOriginKey(cls.subclass.id);
        sectionSort[subKey] = sortIndex + 1;
      }
    });

    context.actor.itemTypes.background.forEach((bg: Item5e) => {
      i += 1;
      sectionSort[buildOriginKey(bg.id)] = i;
    });

    context.actor.itemTypes.race.forEach((species: Item5e) => {
      i += 1;
      sectionSort[buildOriginKey(species.id)] = i;
    });

    const features = Object.values(featuresMap).toSorted(
      (a, b) =>
        (sectionSort[a.key] ?? Infinity) - (sectionSort[b.key] ?? Infinity),
    );

    return features;
  }

  static createQuadroneFeatureSection(args: {
    context: CharacterSheetQuadroneContext;
    tabId: string;
    key: string;
    title: string;
    options: Partial<TidyItemSectionBase>;
    isCustom?: boolean;
  }): FeatureSection {
    const custom = args.isCustom
      ? {
          creationItemTypes: [CONSTANTS.ITEM_TYPE_FEAT],
          section: args.key,
        }
      : undefined;

    const dataset: Record<string, unknown> = args.isCustom
      ? {
          [TidyFlags.section.prop]: args.key,
        }
      : {};

    return {
      type: CONSTANTS.SECTION_TYPE_FEATURE,
      key: args.key,
      sectionActions: [],
      items: [],
      label: args.title,
      show: true,
      dataset,
      custom,
      canCreate: true,
      columns: FeatureColumnRuntime.getColumnSpecifications({
        sheetDocument: args.context.actor,
        tabId: args.tabId,
        sectionKey: args.key,
        editable: args.context.editable,
        owner: args.context.owner,
        unlocked: args.context.unlocked,
      }),
      ...args.options,
    };
  }

  static partitionItem(
    item: Item5e,
    partitions: CharacterItemPartitions,
    inventory: ActorInventoryTypes,
  ) {
    // Suppress riders for disabled enchantments
    if (item.dependentOrigin?.active === false) {
      return;
    } else if (item.type === CONSTANTS.ITEM_TYPE_SPELL) {
      partitions.spells.push(item);
    } else if (item.type === CONSTANTS.ITEM_TYPE_RACE) {
      partitions.species.push(item);
    } else if (item.type === CONSTANTS.ITEM_TYPE_BACKGROUND) {
      partitions.backgrounds.push(item);
    } else if (item.type === CONSTANTS.ITEM_TYPE_CLASS) {
      partitions.classes.push(item);
    } else if (item.type === CONSTANTS.ITEM_TYPE_SUBCLASS) {
      partitions.subclasses.push(item);
    } else if (item.type === CONSTANTS.ITEM_TYPE_FACILITY) {
      partitions.facilities.push(item);
    } else if (Object.keys(inventory).includes(item.type)) {
      partitions.items.push(item);
    } else if (SheetSections.showInFeatures(item)) {
      partitions.feats.push(item);
    }
  }

  // TODO: Figure out how to handle effects with section names that collide with items
  static mergeDuplicateFavoriteSections(
    actor: Actor5e,
    tabId: string,
    sections: FavoriteSection[],
  ) {
    let sectionsMap: Record<
      string,
      Exclude<FavoriteSection, EffectFavoriteSection | ActivitySection>
    > = {};
    for (let section of sections) {
      if (
        section.type === CONSTANTS.SECTION_TYPE_EFFECT ||
        section.type === CONSTANTS.SECTION_TYPE_ACTIVITY
      ) {
        continue;
      }

      const mappedSection = sectionsMap[section.key];

      if (!mappedSection) {
        sectionsMap[section.key] = section;
        continue;
      }

      const incomingItems = section.items;

      if (mappedSection.type !== CONSTANTS.SECTION_TYPE_FEATURE) {
        const mappedItems = mappedSection.items;

        sectionsMap[section.key] =
          CharacterSheetSections.createGenericFavoriteSection(
            actor,
            tabId,
            section.key,
            [...incomingItems, ...mappedItems],
          );

        continue;
      }

      mappedSection.items.push(...incomingItems);
    }

    return Object.values(sectionsMap);
  }

  static createGenericFavoriteSection(
    context: CharacterSheetQuadroneContext,
    tabId: string,
    key: string,
    items: Item5e[],
  ): CharacterFeatureSection {
    return {
      type: 'feature',
      canCreate: false,
      dataset: [],
      items: items,
      key: key,
      label: FoundryAdapter.localize(key),
      custom: {
        creationItemTypes: [],
        section: key,
      },
      isExternal: false,
      show: true,
      sectionActions: [], // for the UI Overhaul
      columns: FeatureColumnRuntime.getColumnSpecifications({
        sheetDocument: context.actor,
        tabId,
        sectionKey: key,
        editable: context.editable,
        owner: context.owner,
        unlocked: context.unlocked,
      }),
    };
  }
}
