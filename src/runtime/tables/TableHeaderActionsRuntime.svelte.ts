import CustomItemHeaderControl from 'src/components/item-list/controls/CustomItemHeaderControl.svelte';
import type { ComponentWithProps } from 'src/utils/component';
import { ActorItemRuntime } from '../ActorItemRuntime';
import type { Actor5e, TidyItemSectionBase } from 'src/types/types';
import { SectionSelectorApplication } from 'src/applications/section-selector/SectionSelectorApplication.svelte';
import { TidyFlags } from 'src/api';

class TableHeaderActionsRuntime {
  getActionHeaderActions(
    actor: Actor5e,
    owner: boolean,
    unlocked: boolean,
    section: TidyItemSectionBase
  ): ComponentWithProps<any>[] {
    if (!owner) {
      return [];
    }

    const renameControl = getItemSectionRenameControl(actor, unlocked, section);

    const runtimeCommands = ActorItemRuntime.getActorItemSectionCommands({
      actor,
      section,
      unlocked,
    }).map(
      (c) =>
        ({
          component: CustomItemHeaderControl,
          props: {
            action: c,
            section,
            sheetDocument: actor,
            unlocked,
          },
        } satisfies ComponentWithProps<typeof CustomItemHeaderControl>)
    );

    // Share, and ensure this particular version saves to Action Section instead of standard section.
    const controls = [renameControl, ...runtimeCommands];

    // TODO: Truncate to row action max size and include context menu.

    return controls;
  }
}

function getItemSectionRenameControl(
  actor: Actor5e,
  unlocked: boolean,
  section: TidyItemSectionBase
): ComponentWithProps<typeof CustomItemHeaderControl> {
  return {
    component: CustomItemHeaderControl,
    props: {
      action: {
        enabled: () => unlocked && !!section.items.length,
        execute: () => {
          new SectionSelectorApplication({
            flag: TidyFlags.actionSection.prop,
            callingDocument: actor,
            document: section.items[0],
            async onSave(newSectionName) {
              const updates = section.items.map((i) => ({
                _id: i.id,
                [TidyFlags.actionSection.prop]: newSectionName,
              }));

              return Item.updateDocuments(updates, { parent: actor });
            },
            sectionType: 'TODO Sheet',
          }).render({ force: true });
        },
        iconClass: 'fa-solid fa-pencil',
        label: 'TODO Rename',
      },
      section,
      sheetDocument: actor,
      unlocked,
    },
  };
}

function getItemActionsContextMenu(
  actor: Actor5e,
  unlocked: boolean,
  section: TidyItemSectionBase
): ComponentWithProps<typeof CustomItemHeaderControl> {
  return {
    component: CustomItemHeaderControl,
    props: {
      action: {
        execute: (params) => {
          alert('todo: trigger section selection dialog for whole section.');
        },
        iconClass: 'fa-solid fa-edit',
        label: 'TODO Rename',
      },
      section,
      sheetDocument: actor,
      unlocked,
    },
  };
}

const singleton = new TableHeaderActionsRuntime();

export default singleton;
