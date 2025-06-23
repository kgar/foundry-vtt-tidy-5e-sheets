export type ThemeColorSetting = {
  /** The key of the configurable entity as found in CONFIG.DND5E. For example, `veryrare` for the "Very Rare" item rarity */
  key: string;
  /** A valid color for CSS. */
  value: string;
};

export type ThemeSettings = {
  accentColor: string;
  headerBackground: string;
  rarityColors: ThemeColorSetting[];
  spellPreparationModeColors: ThemeColorSetting[];
  useSaturatedRarityColors: boolean;
  // etc. settings here ;)
};
