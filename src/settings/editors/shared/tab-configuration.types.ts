export type TabInfo = {
  id: string;
  title: string;
  iconClass?: string;
};

export type TabConfig = {
  id: string;
  title: string;
  iconClass?: string;
  show: boolean;
  visibilityLevel: number;
  order: number;
}

export type TabConfigContextEntry = {
  documentName: string;
  documentType: string;
  title: string;
  allTabs: Record<string, TabInfo>;
  defaultTabs: TabConfig[];
  tabs: TabConfig[];
  /** Replaces the document type as a property when saving world tab configuration info. */
  docTypeKeyOverride?: string;
  sidebarExpandedByTabId?: Record<string, boolean>;
};

export type TabConfigSnapshot = {
  title: string;
  documentName: string;
  documentType: string;
  docTypeKeyOverride: string | null;
  tabs: TabConfig[];
  sidebarExpandedByTabId?: Record<string, boolean>;
};
