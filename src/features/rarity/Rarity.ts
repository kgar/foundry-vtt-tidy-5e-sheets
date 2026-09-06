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

  static getRarityAndLabel(source: any): {
    rarity: string | undefined;
    rarityLabel: string | undefined;
  } {
    const count = source.rarities.size ?? source.rarities.length;

    const rarity =
      count === 1
        ? (source.rarities[0] ?? firstOfSet<string>(source.rarities))
        : undefined;

    const rarityVaries = count > 1;

    const rarityLabel =
      (rarity || rarityVaries) && source.identified === false
        ? FoundryAdapter.localize('DND5E.Unidentified.Title')
        : rarityVaries
          ? FoundryAdapter.localize('TIDY5E.Item.Rarity.Varies.Label')
          : rarity
            ? CONFIG.DND5E.itemRarity[rarity]
            : undefined;

    return { rarity, rarityLabel };
  }

  static getRarityContext(source: any): RarityContext | undefined {
    if (!source.rarities) {
      return undefined;
    }

    return {
      ...Rarity.getRarityAndLabel(source),
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
