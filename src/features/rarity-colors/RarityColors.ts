export class RarityColors {
  static getRarityText(key: string) {
    return CONFIG.DND5E.itemRarity[key] ?? '';
  }

  static getRarityColorVariableName(key: string) {
    return `--t5e-color-rarity-${RarityColors.getRarityText(key).slugify()}`;
  }
}
