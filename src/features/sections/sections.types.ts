export type SectionConfig = {
  key: string;
  order: number;
  show?: boolean;
};

/** Section configuration for a given actor, arranged by tab IDs. */
export type SheetTabSectionConfigs = {
  /** A mapping from tab IDs to arrays of section keys, where the arrays represent the order of the sections. */
  [tabId: string]: {
    [sectionKey: string]: SectionConfig;
  };
};

/** A record of document UUIDs to Section Keys/Names */
export type DocumentSectionAssignments = Record<string, string>;