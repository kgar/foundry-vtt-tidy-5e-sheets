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
  useHeaderBackground: boolean;
  disableHeaderImageEffects: boolean;
  headerBackgroundSize: string;
  headerColor: string;
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

// TODO: Identify the various usages of this Options type and extract multiple alternatives based on their unique uses. There is too much sharing here.
export type ThemeSettingsConfigurationOptions = {
  /**
   * Optional document whose theming is being configured.
   * If not provided, then World Theme Settings are assumed.
   */
  doc?: any;
  /**
   * Use these theme settings when applying the appropriate CSS updates.
   */
  settingsOverride?: ThemeSettingsV3;
  /**
   * Some applications are related to a document but are
   * a separate dialog. This ID override ensures they receive
   * their own style declarations related to their related document.
   */
  idOverride?: string;
  /**
   * Use world theme settings as a baseline when deriving the final styles.
   * Set to false when performing activities like presenting a Sheet-specific Theme Settings form.
   * default: true
   */
  applyWorldThemeSetting?: boolean;
  /** Optional callback to use after settings have been applied. */
  callback?: (params: { settingsOverride?: ThemeSettingsV3 }) => void;
  /** Alternative default settings. */
  alternateDefaults?: Partial<ThemeSettingsV3>;
};

export type PortraitShape = 'transparent' | 'round' | 'square' | 'token';
