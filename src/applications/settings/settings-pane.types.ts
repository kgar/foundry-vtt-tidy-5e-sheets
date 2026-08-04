/**
 * Unified settings footer (Use Global Defaults / Undo Changes / Save Changes)
 * for Settings modal Panes. Every deferred-save settings modal implements
 * {@link SettingsPane}.
 */

export interface SettingsPane {
  hasChanges: boolean;
  /** When saving, applies to every tab in the settings app. */
  apply(): Promise<unknown> | unknown;
  /** Recompute the baseline snapshot so {@link hasChanges} reads clean. */
  _resetToGlobalDefaults(): void;
  /** Revert in-memory edits back to the last-saved baseline (in place). */
  undoChanges(): void;
  /** Stage global/system defaults into memory (in place, no confirm prompt). */
  resetToDefault(): void;
}
