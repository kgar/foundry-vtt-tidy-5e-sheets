import { FoundryAdapter } from 'src/foundry/foundry-adapter';

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

export function createCompositeEditorController(
  ...controllers: (SettingsEditorController | undefined)[]
): SettingsEditorController {
  return {
    canUndo: controllers.some((editor) => !!editor?.canUndo),
    canUseDefault: controllers.some((editor) => !!editor?.canUseDefault),
    hasChanges: controllers.some((editor) => !!editor?.hasChanges),
    save: async () => {
      for (const controller of controllers) {
        await controller?.save();
      }
    },
    undoChanges: () => {
      for (const controller of controllers) {
        controller?.undoChanges();
      }
    },
    useDefault: async () => {
      if (await confirmUseDefault()) {
        for (const controller of controllers) {
          await controller?.resetToDefault();
        }
      }
    },
    useDefaultLabel: controllers.find((editor) => !!editor?.useDefaultLabel)
      ?.useDefaultLabel,
    resetToDefault: async () => {
      for (const controller of controllers) {
        await controller?.resetToDefault();
      }
    },
  };
}

export async function confirmUseDefault(): Promise<boolean> {
  return await foundry.applications.api.DialogV2.confirm({
    window: {
      title: FoundryAdapter.localize('TIDY5E.UseDefaultDialog.title'),
    },
    content: `<p>${FoundryAdapter.localize(
      'TIDY5E.UseDefaultDialog.text',
    )}</p>`,
  });
}
