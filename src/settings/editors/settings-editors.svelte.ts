export type SettingsEditor<T> = SettingsEditorController & {
  /** Get the current staged value. */
  get value(): T;

  /** Set the current staged value. */
  set value(v: T);
};

export type SettingsEditorController = {
  /**
   * Denotes whether the in‑memory state differs from
   * the persisted state.
   */
  hasChanges: boolean;

  /** Load initial state from its source. */
  initialize(): Promise<void> | void;

  /** Set initial state to the value-less default. */
  resetToDefault(): Promise<void> | void;

  /** Prompts confirmation before resetting to default */
  useDefault(): Promise<void>;

  /** Persist the current state. */
  save(): Promise<void>;

  /**
   * Reset in‑memory state back to the last persisted version
   * or value-less default.
   */
  undoChanges(): void;

  /** Denotes whether this editor can be undone. */
  canUndo: boolean;

  /** Denotes whether this editor can revert to default values. */
  canUseDefault: boolean;

  /** Overrides the default "Use Global Defaults" label. */
  useDefaultLabel?: string;
};
