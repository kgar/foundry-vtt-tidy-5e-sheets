import { CONSTANTS } from 'src/constants';
import type { Item5e } from 'src/types/item.types';
import type {
  ActorInventoryTypes,
  CharacterFeatureSection,
  CharacterItemPartitions,
  InventorySection,
} from 'src/types/types';
import { TidyFlags } from 'src/foundry/TidyFlags';

export class CharacterSheetSections {
  static get inventoryItemTypes() {
    return [
      CONSTANTS.ITEM_TYPE_WEAPON,
      CONSTANTS.ITEM_TYPE_EQUIPMENT,
      CONSTANTS.ITEM_TYPE_TOOL,
      CONSTANTS.ITEM_TYPE_CONTAINER,
      CONSTANTS.ITEM_TYPE_LOOT,
    ];
  }

  static applyInventoryItemToSection(
    inventory: Record<string, InventorySection>,
    item: Item5e,
    customSectionOptions: Partial<InventorySection>
  ) {
    const customSectionName = TidyFlags.section.get(item);

    if (!customSectionName) {
      inventory[item.type].items.push(item);
      return;
    }

    const customSection: InventorySection = (inventory[customSectionName] ??= {
      dataset: { [TidyFlags.section.prop]: customSectionName },
      items: [],
      label: customSectionName,
      canCreate: true,
      key: customSectionName,
      custom: {
        section: customSectionName,
        creationItemTypes: CharacterSheetSections.inventoryItemTypes,
      },
      ...customSectionOptions,
    });

    customSection.items.push(item);
  }

  static buildFeaturesSections(
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
        label: CONFIG.Item.typeLabels.race,
        items: races,
        hasActions: false,
        dataset: { type: CONSTANTS.ITEM_TYPE_RACE },
        showRequirementsColumn: true,
        canCreate: true,
        key: 'race',
        ...options,
      },
      background: {
        label: CONFIG.Item.typeLabels.background,
        items: backgrounds,
        hasActions: false,
        dataset: { type: CONSTANTS.ITEM_TYPE_BACKGROUND },
        showRequirementsColumn: true,
        canCreate: true,
        key: 'background',
        ...options,
      },
      classes: {
        label: `${CONFIG.Item.typeLabels.class}Pl`,
        items: classes,
        hasActions: false,
        dataset: { type: CONSTANTS.ITEM_TYPE_CLASS },
        isClass: true,
        showLevelColumn: true,
        canCreate: true,
        key: 'classes',
        ...options,
      },
      active: {
        label: 'DND5E.FeatureActive',
        items: feats.filter((feat) => feat.system.activation?.type),
        hasActions: true,
        dataset: {
          type: CONSTANTS.ITEM_TYPE_FEAT,
          'system.activation.type': 'action',
        },
        showRequirementsColumn: true,
        showUsagesColumn: true,
        showUsesColumn: true,
        canCreate: true,
        key: 'active',
        ...options,
      },
      passive: {
        label: 'DND5E.FeaturePassive',
        items: feats.filter((feat) => !feat.system.activation?.type),
        hasActions: false,
        dataset: { type: CONSTANTS.ITEM_TYPE_FEAT },
        showRequirementsColumn: true,
        canCreate: true,
        key: 'passive',
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
    ] ??= {
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
      showRequirementsColumn: true,
      key: customSectionName,
      custom: {
        section: customSectionName,
        creationItemTypes: [CONSTANTS.ITEM_TYPE_FEAT],
      },
      ...customSectionOptions,
    });

    customSection.items.push(feat);
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
      partitions.races.push(item);
    } else if (item.type === CONSTANTS.ITEM_TYPE_BACKGROUND) {
      partitions.backgrounds.push(item);
    } else if (item.type === CONSTANTS.ITEM_TYPE_CLASS) {
      partitions.classes.push(item);
    } else if (item.type === CONSTANTS.ITEM_TYPE_SUBCLASS) {
      partitions.subclasses.push(item);
    } else if (Object.keys(inventory).includes(item.type)) {
      partitions.items.push(item);
    }
  }
}
