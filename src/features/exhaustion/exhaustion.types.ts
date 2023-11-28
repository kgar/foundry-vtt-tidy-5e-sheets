export type OpenExhaustionConfig = {
  /**
   * Opens exhaustion to be set to any permissible value in the actor exhaustion schema.
   */
  type: 'open';
};

export type SpecificExhaustionConfig = {
  /**
   * Limits exhaustion to a specific number of levels.
   */
  type: 'specific';
  /**
   * The number of levels of exhaustion, excluding level 0.
   */
  levels: number;
  /**
   * An array of hints to use for tooltips when interacting with the exhaustion tracker.
   */
  hints: string[];
};

export type ExhaustionConfig = OpenExhaustionConfig | SpecificExhaustionConfig;

export type IconWithSeverity = {
  iconCssClass: string;
  severity: number;
};
