export interface DefaultCustomSectionSetting {
  /** The section name. Localizable keys are also supported. */
  section: string;

  /** Determines whether the section should be visible even when there are no items  */
  alwaysShow: boolean;

  /**
   * Limits this section to the indicated sheet types when utilizing default custom sections.
   * If this array is empty, then apply this section to all sheet types.
   */
  filterBySheetType: string[];

  /**
   * Limits this section to the indicated tab IDs when utilizing default custom sections.
   * If this array is empty, then apply this section to all tabs where
   * default custom sections are considered.
   */
  filterByTabId: string[];

  // TODO: Expand the feature with more cool stuff
}
