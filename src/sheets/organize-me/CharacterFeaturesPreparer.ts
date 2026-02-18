import { CONSTANTS } from 'src/constants';
import { CharacterSheetSections } from 'src/features/sections/CharacterSheetSections';
import { SheetSections } from 'src/features/sections/SheetSections';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Item5e } from 'src/types/item.types';
import type {
  CharacterFeatureSection,
  CharacterSheetQuadroneContext,
} from 'src/types/types';
import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { isNil } from 'src/utils/data';

export class CharacterFeaturesPreparer {
  context: CharacterSheetQuadroneContext;
  features: Record<string, CharacterFeatureSection>;
  options: Partial<CharacterFeatureSection>;
  tabId: string;
  customSectionFlag: 'section' | 'actionSection';
  otherFeaturesKey = 'tidy-feature-section-others';

  constructor(
    context: CharacterSheetQuadroneContext,
    tabId: string,
    customSectionFlag: 'section' | 'actionSection' = 'section',
  ) {
    this.context = context;
    this.customSectionFlag = customSectionFlag;
    this.tabId = tabId;
    this.options = {
      canCreate: true,
      rowActions: TableRowActionsRuntime.getCharacterFeatureRowActions(context),
    };
    this.features = {
      [this.otherFeaturesKey]:
        CharacterSheetSections.createQuadroneFeatureSection({
          key: this.otherFeaturesKey,
          title: FoundryAdapter.localize('DND5E.FeaturesOther'),
          options: this.options,
        }),
    };
  }

  isEligible(item: Item5e) {
    return SheetSections.showInFeatures(item);
  }

  processItem(item: Item5e) {
    if (!this.isEligible(item)) {
      return;
    }

    // custom section
    let customSection = TidyFlags[this.customSectionFlag].get(item);

    if (!isNil(customSection)) {
      // Partition/Create Custom Section and add item
      let section = (this.features[customSection] ??=
        CharacterSheetSections.createQuadroneFeatureSection({
          key: customSection,
          title: FoundryAdapter.localize(customSection),
          options: this.options,
          custom: true,
        }));

      section.items.push(item);
      return;
    }

    // partition origin feats
    const [originId] =
      item
        .getFlag('dnd5e', CONSTANTS.SYSTEM_FLAG_ADVANCEMENT_ORIGIN)
        ?.split('.') ?? [];
    // get adv origin
    let originItem = this.context.actor.items.get(originId);

    if (originItem) {
      let key = this._buildOriginKey(originId);

      let section = this.features[key];

      if (!section) {
        section = this.features[key] = this._buildOriginSection(
          key,
          originItem,
          this.options,
        );
      }

      this.features[key].items.push(item);

      return;
    }

    let section = this.features[this.otherFeaturesKey];
    section.items.push(item);
  }

  toSections() {
    if (this.context.unlocked) {
      Object.values(this.context.actor.classes)
        .concat(Object.values(this.context.actor.itemTypes.background))
        .concat(Object.values(this.context.actor.itemTypes.race))
        .concat(Object.values(this.context.actor.itemTypes.subclass))
        .forEach((originItem: Item5e) => {
          let key = this._buildOriginKey(originItem.id);
          this.features[key] ??= this._buildOriginSection(
            key,
            originItem,
            this.options,
          );
        });
    }

    SheetSections.getFilteredGlobalSectionsToShowWhenEmpty(
      this.context.actor,
      this.tabId,
    ).forEach((s) => {
      this.features[s] ??= CharacterSheetSections.createQuadroneFeatureSection({
        key: s,
        options: this.options,
        title: FoundryAdapter.localize(s),
        custom: true,
      });
    });
  }

  private _buildOriginKey(id: string) {
    return `tidy-feature-section-origin-${id}`;
  }

  private _buildOriginSection(
    key: string,
    item: Item5e,
    options: Partial<CharacterFeatureSection>,
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
}
