export type ConfigTabInfo = {
  id: string;
  title: string;
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
};