// TODO: Consider creating a service that handles everything outside of getting/storing.
export type ThemeColorSetting = {
  key: string;
  value: string;
};

export type ThemeSettings = {
  colors: ThemeColorSetting[];
  useSaturatedRarityColors?: boolean;
  // etc. settings here ;)
};
