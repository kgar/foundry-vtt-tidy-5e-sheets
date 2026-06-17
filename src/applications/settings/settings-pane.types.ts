/**
 * Unified settings footer (Use Global Defaults / Undo Changes / Save Changes)
 * for Settings modal Panes. Every deferred-save settings modal implements
 * {@link SettingsPane}. Panes implement {@link SettingsFooterHost} and decide the
 * scope of Undo / Use Global Defaults (active page vs. whole dialog).
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

export interface SettingsFooterHost {
  /** Holds changed state across the host's pages for the Save button. */
  hasChanges: boolean;
  canUndo: boolean;
  canUseDefault: boolean;
  /** Overrides the default "Use Global Defaults" label. */
  useDefaultLabel?: string;
  /** Persist every page, then close the window. */
  save(): Promise<void>;
  /** Revert edits (active page or whole dialog, host's choice). */
  undoChanges(): void;
  /** Confirm, then stage defaults (active page or whole dialog, host's choice). */
  useDefault(): Promise<void> | void;
}
