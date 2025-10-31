export type ConfigTabInfo = {
  id: string;
  title: string;
};

export type VisibilityLevelConfig = ConfigTabInfo & {
  visibilityLevel: number | null;
};

export type TabConfigContextEntry = {
  documentName: string;
  documentType: string;
  title: string;
  allTabs: Record<string, ConfigTabInfo>;
  worldDefaultSelected: ConfigTabInfo[];
  defaultSelected: ConfigTabInfo[];
  defaultUnselected: ConfigTabInfo[];
  selected: ConfigTabInfo[];
  unselected: ConfigTabInfo[];
  visibilityLevels: VisibilityLevelConfig[];
  /** Replaces the document type as a property when saving world tab configuration info. */
  docTypeKeyOverride?: string;
};
