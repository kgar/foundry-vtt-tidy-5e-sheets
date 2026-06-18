import type { Actor5e } from 'src/types/types';
import type { SettingsEditor } from './settings-editors.svelte';
import type { Item5e } from 'src/types/item.types';
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export type SpellSourceItemAssignment = {
  /**
   * The spell name.
   */
  name: string;

  /**
   * The spell _id field.
   */
  _id: string;

  /**
   * The spell uuid field.
   */
  uuid: string;

  /**
   * The chosen source item.
   */
  sourceItem: string;
};

export type SpellSourceItemAssignmentsContext = {
  assignments: SpellSourceItemAssignment[];
};

export type SpellSourceItemAssignmentsSettingsEditor =
  SettingsEditor<SpellSourceItemAssignmentsContext> & {
    document: Actor5e;
  };

export function getSpellSourceItemAssignmentsSettingsEditor(
  document: Actor5e,
): SpellSourceItemAssignmentsSettingsEditor {
  const current = $state<SpellSourceItemAssignmentsContext>(getConfig());

  let initialSnapshot = $state(snapshotConfig(current));

  const hasChanges = $derived(JSON.stringify(current) !== initialSnapshot);

  function snapshotConfig(config: SpellSourceItemAssignmentsContext) {
    return JSON.stringify($state.snapshot(config));
  }

  function getConfig(): SpellSourceItemAssignmentsContext {
    return {
      assignments: document.itemTypes.spell
        .filter((item: Item5e) => {
          const sourceItemLocked =
            item.system.sourceItem &&
            document.identifiedItems.get(item.system.sourceItem)?.first()
              ?.type !== CONSTANTS.ITEM_TYPE_CLASS;

          return !sourceItemLocked && !item.system.linkedActivity;
        })
        .map(
          (item: Item5e) =>
            ({
              name: item.name,
              _id: item._id,
              uuid: item.uuid,
              sourceItem: item.system.sourceItem,
            }) satisfies SpellSourceItemAssignment,
        ),
    };
  }

  return {
    get hasChanges() {
      return hasChanges;
    },

    get canUndo() {
      return this.hasChanges;
    },

    canUseDefault: true,

    resetToDefault() {
      // TODO: find out - '' or undefined?
      this.value.assignments.forEach(
        (assignment) => (assignment.sourceItem = ''),
      );
    },

    async save() {
      const updateData = this.value.assignments.map((assignment) => ({
        _id: assignment._id,
        'system.sourceItem': assignment.sourceItem,
      }));

      await document.updateEmbeddedDocuments('Item', updateData);
    },

    undoChanges() {
      this.value = JSON.parse(initialSnapshot);
    },

    async useDefault() {
      const proceed = await foundry.applications.api.DialogV2.confirm({
        window: {
          title: FoundryAdapter.localize('TIDY5E.UseDefaultDialog.title'),
        },
        content: `<p>${FoundryAdapter.localize(
          'TIDY5E.UseDefaultDialog.text',
        )}</p>`,
      });

      if (!proceed) {
        return;
      }

      this.resetToDefault();
    },

    get value() {
      return current;
    },

    set value(value) {
      this.value.assignments = value.assignments;
    },

    document,
  };
}
