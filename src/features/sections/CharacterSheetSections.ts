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
} from 'src/types/types';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SheetSections } from './SheetSections';
import { isNil } from 'src/utils/data';

export class CharacterSheetSections {
  static buildClassicFeaturesSections(
    actor: any,
    tabId: string,
    races: any[],
    backgrounds: any[],
    classes: any[],
    feats: any[],
    options: Partial<CharacterFeatureSection>
  ): Record<string, CharacterFeatureSection> {
    const customFeats = feats.filter((f) => TidyFlags.section.get(f));
    feats = feats.filter((f) => !TidyFlags.section.get(f));

    const features: Record<string, CharacterFeatureSection> = {
      race: {
        type: CONSTANTS.SECTION_TYPE_FEATURE,
        label: CONFIG.Item.typeLabels.race,
        items: races,
        hasActions: false,
        dataset: { type: CONSTANTS.ITEM_TYPE_RACE },
        showRequirementsColumn: true,
        canCreate: true,
        key: CONSTANTS.CHARACTER_FEAT_SECTION_RACE,
        show: true,
        rowActions: [], // for the UI Overhaul
        ...options,
      },
      background: {
        type: CONSTANTS.SECTION_TYPE_FEATURE,
        label: CONFIG.Item.typeLabels.background,
        items: backgrounds,
        hasActions: false,
        dataset: { type: CONSTANTS.ITEM_TYPE_BACKGROUND },
        showRequirementsColumn: true,
        canCreate: true,
        key: CONSTANTS.CHARACTER_FEAT_SECTION_BACKGROUND,
        show: true,
        rowActions: [], // for the UI Overhaul
        ...options,
      },
      classes: {
        type: CONSTANTS.SECTION_TYPE_FEATURE,
        label: `${CONFIG.Item.typeLabels.class}Pl`,
        items: classes,
        hasActions: false,
        dataset: { type: CONSTANTS.ITEM_TYPE_CLASS },
        isClass: true,
        showLevelColumn: true,
        canCreate: true,
        key: CONSTANTS.CHARACTER_FEAT_SECTION_CLASSES,
        show: true,
        rowActions: [], // for the UI Overhaul
        ...options,
      },
      active: {
        type: CONSTANTS.SECTION_TYPE_FEATURE,
        label: 'DND5E.FeatureActive',
        items: feats.filter((feat) => !!feat.system.activities?.size),
        hasActions: true,
        dataset: {
          type: CONSTANTS.ITEM_TYPE_FEAT,
        },
        showFeatureTypeColumn: true,
        showRequirementsColumn: true,
        showUsagesColumn: true,
        showUsesColumn: true,
        canCreate: true,
        key: CONSTANTS.CHARACTER_FEAT_SECTION_ACTIVE,
        show: true,
        rowActions: [], // for the UI Overhaul
        ...options,
      },
      passive: {
        type: CONSTANTS.SECTION_TYPE_FEATURE,
        label: 'DND5E.FeaturePassive',
        items: feats.filter((feat) => !feat.system.activities?.size),
        hasActions: false,
        dataset: { type: CONSTANTS.ITEM_TYPE_FEAT },
        showFeatureTypeColumn: true,
        showRequirementsColumn: true,
        showUsesColumn: true,
        canCreate: true,
        key: CONSTANTS.CHARACTER_FEAT_SECTION_PASSIVE,
        show: true,
        rowActions: [], // for the UI Overhaul
        ...options,
      },
    };

    customFeats.forEach((f) =>
      CharacterSheetSections.applyCharacterFeatureToSection(
        features,
        f,
        options
      )
    );

    SheetSections.getFilteredGlobalSectionsToShowWhenEmpty(
      actor,
      tabId
    ).forEach((s) => {
      features[s] ??= CharacterSheetSections.createFeatureSection(s, {
        canCreate: true,
        ...options,
      });
    });

    return features;
  }

  static applyCharacterFeatureToSection(
    features: Record<string, CharacterFeatureSection>,
    feat: Item5e,
    customSectionOptions: Partial<CharacterFeatureSection>
  ) {
    const customSectionName = TidyFlags.section.get(feat);

    if (!customSectionName) {
      return;
    }

    const customSection: CharacterFeatureSection = (features[
      customSectionName
    ] ??= CharacterSheetSections.createFeatureSection(
      customSectionName,
      customSectionOptions
    ));

    customSection.items.push(feat);
  }

  static createFeatureSection(
    customSectionName: string,
    customSectionOptions: Partial<CharacterFeatureSection>
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
      rowActions: [], // for the UI Overhaul
      ...customSectionOptions,
    };
  }

  static buildQuadroneFeatureSections(
    actor: Actor5e,
    unlocked: boolean,
    tabId: string,
    feats: Item5e[],
    options: Partial<CharacterFeatureSection>
  ): FeatureSection[] {
    let featuresMap: Record<string, FeatureSection> = {};

    function buildOriginKey(id: string) {
      return `tidy-feature-section-origin-${id}`;
    }

    function buildOriginSection(
      key: string,
      item: Item5e,
      options: Partial<CharacterFeatureSection>
    ) {
      return CharacterSheetSections.createQuadroneFeatureSection({
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
            key: customSection,
            title: FoundryAdapter.localize(customSection),
            options,
            custom: true,
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
      let originItem = actor.items.get(originId);

      if (originItem) {
        let key = buildOriginKey(originId);

        let section = featuresMap[key];

        if (!section) {
          section = featuresMap[key] = buildOriginSection(
            key,
            originItem,
            options
          );
        }

        featuresMap[key].items.push(feat);

        continue;
      }

      let section = (featuresMap[otherFeaturesKey] ??= otherFeaturesSection);
      section.items.push(feat);
    }

    if (unlocked) {
      featuresMap[otherFeaturesKey] ??= otherFeaturesSection;

      Object.values(actor.classes)
        .concat(Object.values(actor.itemTypes.background))
        .concat(Object.values(actor.itemTypes.race))
        .concat(Object.values(actor.itemTypes.subclass))
        .forEach((originItem: Item5e) => {
          let key = buildOriginKey(originItem.id);
          featuresMap[key] ??= buildOriginSection(key, originItem, options);
        });
    }

    SheetSections.getFilteredGlobalSectionsToShowWhenEmpty(
      actor,
      tabId
    ).forEach((s) => {
      featuresMap[s] ??= CharacterSheetSections.createQuadroneFeatureSection({
        key: s,
        options,
        title: FoundryAdapter.localize(s),
        custom: true,
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

    Object.values(actor.classes).forEach((cls: Item5e) => {
      let sortIndex = cls.system.isOriginalClass ? 0 : (i += 2);
      const clsKey = buildOriginKey(cls.id);
      sectionSort[clsKey] = sortIndex;

      if (cls.subclass) {
        const subKey = buildOriginKey(cls.subclass.id);
        sectionSort[subKey] = sortIndex + 1;
      }
    });

    actor.itemTypes.background.forEach((bg: Item5e) => {
      i += 1;
      sectionSort[buildOriginKey(bg.id)] = i;
    });

    actor.itemTypes.race.forEach((species: Item5e) => {
      i += 1;
      sectionSort[buildOriginKey(species.id)] = i;
    });

    const features = Object.values(featuresMap).toSorted(
      (a, b) =>
        (sectionSort[a.key] ?? Infinity) - (sectionSort[b.key] ?? Infinity)
    );

    return features;
  }

  static createQuadroneFeatureSection(args: {
    key: string;
    title: string;
    options: Partial<TidyItemSectionBase>;
    custom?: boolean;
  }): FeatureSection {
    let custom = args.custom
      ? {
          creationItemTypes: [CONSTANTS.ITEM_TYPE_FEAT],
          section: args.key,
        }
      : undefined;

    return {
      type: CONSTANTS.SECTION_TYPE_FEATURE,
      key: args.key,
      rowActions: [],
      items: [],
      label: args.title,
      show: true,
      dataset: {},
      custom,
      canCreate: true,
      ...args.options,
    };
  }

  static partitionItem(
    item: Item5e,
    partitions: CharacterItemPartitions,
    inventory: ActorInventoryTypes
  ) {
    if (item.type === CONSTANTS.ITEM_TYPE_SPELL) {
      partitions.spells.push(item);
    } else if (item.type === CONSTANTS.ITEM_TYPE_FEAT) {
      partitions.feats.push(item);
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
    }
  }

  // TODO: Figure out how to handle effects with section names that collide with items
  static mergeDuplicateFavoriteSections(sections: FavoriteSection[]) {
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
          CharacterSheetSections.createGenericFavoriteSection(section.key, [
            ...incomingItems,
            ...mappedItems,
          ]);

        continue;
      }

      mappedSection.items.push(...incomingItems);
    }

    return Object.values(sectionsMap);
  }

  static getItemsFromFavoriteSection(
    section: Exclude<FavoriteSection, EffectFavoriteSection | ActivitySection>
  ) {
    return section.type === CONSTANTS.TAB_ACTOR_SPELLBOOK
      ? section.spells
      : section.items;
  }

  static createGenericFavoriteSection(
    key: string,
    items: Item5e[]
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
      rowActions: [], // for the UI Overhaul
    };
  }
}
