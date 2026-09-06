import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Item5e, RarityContext } from 'src/types/item.types';
import { firstOfSet } from 'src/utils/set';

export class Rarity {
  static getRarityText(key: string) {
    return CONFIG.DND5E.itemRarity[key] ?? '';
  }

  static getRarityColorVariableName(key: string) {
    return `--t5e-color-rarity-${Rarity.getRarityText(key).slugify()}`;
  }

  // TODO: Reevaluate whether I need to use document sheet context source
  // (shows effective rarities on lock, and raw rarities on unlock)
  static getRarityAndLabel(item: Item5e): {
    rarity: string | undefined;
    rarityLabel: string | undefined;
  } {
    const rarity =
      item.system.rarities.size === 1
        ? firstOfSet<string>(item.system.rarities)
        : undefined;

    const rarityVaries = item.system.rarities.size > 1;

    const rarityLabel =
      (rarity || rarityVaries) && item.system.identified === false
        ? FoundryAdapter.localize('DND5E.Unidentified.Title')
        : rarityVaries
          ? FoundryAdapter.localize('TIDY5E.Item.Rarity.Varies.Label')
          : rarity
            ? CONFIG.DND5E.itemRarity[rarity]
            : undefined;

    return { rarity, rarityLabel };
  }

  static getRarityContext(
    item: Item5e,
    source: any,
  ): RarityContext | undefined {
    if (!item.system.rarities) {
      return undefined;
    }

    return {
      ...Rarity.getRarityAndLabel(item),
      options: Object.entries(CONFIG.DND5E.itemRarity).reduce(
        (arr: RarityContext['options'], [key, label]: any) => {
          arr.push({
            label,
            value: key,
            selected:
              source.rarities?.includes?.(key) ?? source.rarities?.has?.(key),
          });
          return arr;
        },
        [],
      ),
    };
  }
}
