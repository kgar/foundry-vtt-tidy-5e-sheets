export type ConfigTabInfo = {
  id: string;
  title: string;
  visibilityLevel: number;
};

export type TabConfigContextEntry = {
  documentName: string;
  documentType: string;
  title: string;
  allTabs: Record<string, ConfigTabInfo>;
  defaultSelected: ConfigTabInfo[];
  defaultUnselected: ConfigTabInfo[];
  selected: ConfigTabInfo[];
  unselected: ConfigTabInfo[];
  /** Replaces the document type as a property when saving world tab configuration info. */
  docTypeKeyOverride?: string;
};