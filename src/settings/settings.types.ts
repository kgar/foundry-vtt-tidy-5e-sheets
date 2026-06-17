export interface GlobalCustomSectionSheetFilters {
  [sheetType: string]: string[];
}

export interface GlobalCustomSectionsetting {
  /** The section name. Localizable keys are also supported. */
  section: string;

  /** Determines whether the section should be visible even when there are no items  */
  showWhenEmpty: boolean;

  /**
   * Limits this section to the indicated sheet types' indicated tab IDs
   * when utilizing default custom sections.
   * If this object empty, then apply this section to all sheet types and all tabs.
   */
  showWhenEmptyFilters: GlobalCustomSectionSheetFilters;
}

export type SheetTabConfigEntry = {
  key: string;
  order: number;
  show: boolean;
  visibilityLevel: number | null;
};

export type SheetTabConfiguration = {
  selected: string[];
  visibilityLevels: Record<string, number | null>;
  /**
   * Tab config (sort order, visibility, and viewer level).
   * Populated from `selected`/`visibilityLevels` on load.
   * TODO: Migrate off legacy fields
   */
  tabs?: Record<string, SheetTabConfigEntry>;
};

export type TabConfiguration = {
  [documentName: string]: {
    [documentType: string]: SheetTabConfiguration;
  };
};

export type SheetHeaderControlConfiguration = {
  header: string[];
  menu: string[];
};

export type HeaderControlConfiguration = {
  [documentName: string]: {
    [documentType: string]: SheetHeaderControlConfiguration;
  };
};
