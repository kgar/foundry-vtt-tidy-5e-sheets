export type TabInfo = {
  id: string;
  title: string;
  iconClass?: string;
};

export type ConfigTabInfo = TabInfo & {
  // TODO: We need a migration to switch to this off the old "unselected" property
  show: boolean;
};

export type VisibilityLevelConfig = ConfigTabInfo & {
  visibilityLevel: number | null;
};

export type TabConfigContextEntry = {
  documentName: string;
  documentType: string;
  title: string;
  allTabs: Record<string, ConfigTabInfo>;
  // TODO: This is the new container for defaults, `show` is used to determine if the tab is visible or not
  defaultTabs: ConfigTabInfo[];
  tabs: ConfigTabInfo[];

  // TODO: Legacy fields, retained optionally during the transition to the
  // single `tabs`/`defaultTabs` arrays. Migrate consumers off these, then remove.
  defaultSelected?: ConfigTabInfo[];
  defaultUnselected?: ConfigTabInfo[];
  selected?: ConfigTabInfo[];
  unselected?: ConfigTabInfo[];
  visibilityLevels: VisibilityLevelConfig[];
  /** Replaces the document type as a property when saving world tab configuration info. */
  docTypeKeyOverride?: string;
  sidebarExpandedByTabId?: Record<string, boolean>;
};

export type TabConfigSnapshot = {
  title: string;
  documentName: string;
  documentType: string;
  docTypeKeyOverride: string | null;
  tabs: { id: string; show: boolean }[];
  visibilityLevels: Record<string, number | null>;
  sidebarExpandedByTabId?: Record<string, boolean>;
};