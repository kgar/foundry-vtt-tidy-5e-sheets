export type ThemeColorSetting = {
  /** The key of the configurable entity as found in CONFIG.DND5E. For example, `veryrare` for the "Very Rare" item rarity */
  key: string;
  /** A valid color for CSS. */
  value: string;
};

export type ThemeSettingsV2Old = {
  accentColor: string;
  actorHeaderBackground: string;
  itemSidebarBackground: string;
  portraitShape: PortraitShape | undefined;
  rarityColors: Record<string, string>;
  spellPreparationModeColors: Record<string, string>;
  // etc. settings here ;)
};

export type ThemeSettingsV3 = {
  accentColor: string;
  actorHeaderBackground: string;
  itemSidebarBackground: string;
  portraitShape: PortraitShape | undefined;
  rarityColors: Record<string, string>;
  spellPreparationMethodColors: Record<string, string>;
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
  settingsOverride?: ThemeSettingsV3;
  /**
   * Some applications are related to a document but are
   * a separate dialog. This ID override ensures they receive
   * their own style declarations related to their related document.
   */
  idOverride?: string;
};

export type PortraitShape = 'transparent' | 'round' | 'square' | 'token';
