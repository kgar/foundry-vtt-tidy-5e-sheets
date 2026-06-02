/**
 * Shared contract for the unified settings footer (Use Global Defaults / Undo
 * Changes / Save Changes). Every deferred-save settings page implements
 * {@link SettingsPane}; whoever owns the footer (a composite dialog or a
 * standalone window) implements {@link SettingsFooterHost} and decides the
 * scope of Undo / Use Global Defaults (active page vs. whole dialog).
 */

export interface SettingsPane {
  /** Whether the pane has unsaved edits relative to its last-saved baseline. */
  hasChanges: boolean;
  /** Persist the pane's in-memory state. Called for every pane on a dialog Save. */
  apply(): Promise<unknown> | unknown;
  /** Recompute the baseline snapshot so {@link hasChanges} reads clean. */
  _resetToGlobalDefaults(): void;
  /** Revert in-memory edits back to the last-saved baseline (in place). */
  undoChanges(): void;
  /** Stage global/system defaults into memory (in place, no confirm prompt). */
  resetToDefault(): void;
}

export interface SettingsFooterHost {
  /** Aggregate dirty state across the host's pages; drives the Save button. */
  hasChanges: boolean;
  /** Whether Undo Changes is enabled. */
  canUndo: boolean;
  /** Whether Use Global Defaults is enabled. */
  canUseDefault: boolean;
  /** Localization key overriding the default "Use Global Defaults" label. */
  useDefaultLabel?: string;
  /** Persist every page, then close the window. */
  save(): Promise<void>;
  /** Revert edits (active page or whole dialog, host's choice). */
  undoChanges(): void;
  /** Confirm, then stage defaults (active page or whole dialog, host's choice). */
  useDefault(): Promise<void> | void;
}
