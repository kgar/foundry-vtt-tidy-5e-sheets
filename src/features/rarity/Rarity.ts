import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Item5e, RarityContext } from 'src/types/item.types';
import { firstOfSet } from 'src/utils/set';

export class Rarity {
  static getRarityText(key: string) {
    return CONFIG.DND5E.itemRarity[key] ?? '';
  }

  static getRarityColorVariableName(key: string) {
    // Drive from Tidy to get `very-rare` instead of `veryrare`.
    // TODO: Fix this everywhere in Tidy?
    return `--t5e-color-rarity-${key.toLowerCase().slugify()}`;
  }

  /**
   * The CSS `var()` reference for a rarity's color, so theme overrides still apply.
   * The fallback matters: an unresolved custom property invalidates the whole
   * declaration it sits in, which would take an entire gradient down with it.
   */
  static getRarityColorVariable(key: string) {
    return `var(${Rarity.getRarityColorVariableName(key)}, var(--t5e-color-gold))`;
  }

  /**
   * Builds a gradient of supplied rarity colors.
   * Returns `undefined` when there isn't more than one rarity to blend.
   */
  static getRarityVariesGradient(
    keys: string[],
    options: {
      angle?: string;
      transform?: (colorVariable: string) => string;
    } = {},
  ): string | undefined {
    if (keys.length < 2) {
      return undefined;
    }

    const { angle = '135deg', transform } = options;

    // The transform is supplied by the caller, but is used to lighten up the text colors since
    // the sidebar is always dark. 
    const stops = keys.map((key) => {
      const colorVariable = Rarity.getRarityColorVariable(key);
      return transform ? transform(colorVariable) : colorVariable;
    });

    return `linear-gradient(${angle}, ${stops.join(', ')})`;
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
          ? FoundryAdapter.localize('TIDY5E.ITEM.Rarity.Varies')
          : rarity
            ? CONFIG.DND5E.itemRarity[rarity]
            : undefined;

    return { rarity, rarityLabel };
  }

  static getRarityContext(source: any): RarityContext | undefined {
    if (!source.rarities) {
      return undefined;
    }

    const options = Object.entries(CONFIG.DND5E.itemRarity).reduce(
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
    );

    return {
      ...Rarity.getRarityAndLabel(source),
      options,
      selectedRarities: options
        .filter((option) => option.selected)
        .map((option) => option.value),
    };
  }
}
