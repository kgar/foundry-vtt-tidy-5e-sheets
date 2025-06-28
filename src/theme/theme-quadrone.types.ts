export type ThemeColorSetting = {
  /** The key of the configurable entity as found in CONFIG.DND5E. For example, `veryrare` for the "Very Rare" item rarity */
  key: string;
  /** A valid color for CSS. */
  value: string;
};

export type ThemeSettings = {
  accentColor: string;
  headerBackground: string;
  rarityColors: Record<string, string>;
  spellPreparationModeColors: Record<string, string>;
  useSaturatedRarityColors: boolean;
  // etc. settings here ;)
};

export type ThemeQuadroneStyleRule = {
  property: string;
  value: string;
};

export type ThemeQuadroneStyleDeclaration = {
  selector: string;
  ruleset: ThemeQuadroneStyleRule[];
  identifier: string;
};

export type ThemeSettingsConfigurationOptions = {
  doc?: any;
  mergeParentDocumentSettings?: boolean;
  settingsOverride?: ThemeSettings;
  idOverride?: string;
};
