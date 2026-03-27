import { mount } from 'svelte';
import AssignSpellsToSourceItems from './SpellSourceItemAssignments.svelte';
import type { Actor5e } from 'src/types/types';
import type { Item5e } from 'src/types/item.types';
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';
import type {
  ApplicationConfiguration,
  DocumentSheetApplicationConfiguration,
} from 'src/types/application.types';
import { DocumentSheetDialog } from 'src/applications-quadrone/DocumentSheetDialog.svelte';

export type SpellSourceItemAssignment = {
  /**
   * The spell to receive an assignment.
   */
  item: Item5e;
  /**
   * Represents the chosen source item. Always a class in this context.
   */
  sourceItem: string;
};

export type SpellSourceItemAssignmentsContext = {
  actor: Actor5e;
  assignments: SpellSourceItemAssignment[];
};

export default class SpellSourceItemAssignmentsFormApplication extends DocumentSheetDialog<
  DocumentSheetApplicationConfiguration,
  SpellSourceItemAssignmentsContext
>() {
  context = new CoarseReactivityProvider<
    SpellSourceItemAssignmentsContext | undefined
  >(undefined);
  updateHook: number | undefined;

  static DEFAULT_OPTIONS: Partial<ApplicationConfiguration> = {
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      CONSTANTS.SHEET_LAYOUT_QUADRONE,
      'tidy-spell-source-class-assignments-application',
      'scrollable-window-content',
    ],
    id: 'tidy-spell-source-class-assignments-{id}',
    sheetConfig: false,
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
    },
    position: {
      width: 700,
      height: 500,
    },
    actions: {},
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    return mount(AssignSpellsToSourceItems, {
      target: node,
      context: new Map<any, any>([
        ['appId', this.appId],
        ['context', this._context],
      ]),
    });
  }

  async _prepareContext(): Promise<SpellSourceItemAssignmentsContext> {
    return {
      actor: this.document,
      assignments: this.document.items
        .filter((item: Item5e) => {
          const sourceItemLocked =
            item.system.sourceItem &&
            this.document.identifiedItems.get(item.system.sourceItem)?.first()
              ?.type !== CONSTANTS.ITEM_TYPE_CLASS;

          return (
            !sourceItemLocked &&
            item.type === CONSTANTS.ITEM_TYPE_SPELL &&
            !item.system.linkedActivity
          );
        })
        .map((item: Item5e) => ({
          item,
          sourceItem: 'test',
        })),
    };
  }

  get title() {
    return FoundryAdapter.localize('TIDY5E.Utilities.AssignSpellsToClasses');
  }
}
