import type { Actor5e } from 'src/types/types';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import type { Group5eMember } from 'src/types/group.types';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { SectionSelectorApplication } from 'src/applications/section-selector/SectionSelectorApplication.svelte';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { SheetSections } from 'src/features/sections/SheetSections';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export function configureGroupContextMenu(element: HTMLElement, app: any) {
  const isQuadroneSheet = element.closest('.quadrone');

  if (isQuadroneSheet) {
    const { uuid } = element.dataset;
    const actor = app.document.system.members.find(
      (m: Group5eMember) => m.actor.uuid === uuid,
    )?.actor;

    if (actor) {
      ui.context.menuItems = getGroupMemberContextOptions(app.document, actor);
    }

    TidyHooks.tidy5eSheetsGetGroupMemberContextOptions(
      app.document,
      actor,
      ui.context.menuItems,
    );

    return;
  }
}

/**
 * Prepare an array of context menu options which are available for a member of a group.
 * @param group    The group for which the context menu is activated.
 * @param actor    The actor for whom the context menu is activate.
 * @returns        Context menu options.
 */
export function getGroupMemberContextOptions(
  group: Actor5e,
  actor: Actor5e,
): ContextMenuEntry[] {
  let options: ContextMenuEntry[] = [
    {
      name: 'DND5E.Group.Action.View',
      icon: `<i class="fa-solid fa-eye fa-fw"></i>`,
      callback: async () =>
        group.sheet._openDocumentSheet(await fromUuid(actor.uuid)),
      condition: () =>
        group.isOwner && !FoundryAdapter.isLockedInCompendium(group),
      group: 'common',
    },
    {
      name: 'TIDY5E.Section.SectionSelectorChooseSectionTooltip',
      icon: '<i class="fa-solid fa-diagram-cells"></i>',
      condition: () => group.isOwner,
      group: 'customize',
      callback: () =>
        group.sheet._renderChild(
          new SectionSelectorApplication({
            flag: `${TidyFlags.sections.prop}.${actor.id}`,
            sectionType: FoundryAdapter.localize('TIDY5E.Section.Label'),
            callingDocument: group,
            document: group,
            getKnownCustomSections:
              SheetSections.getKnownCustomGroupMemberSections,
          }),
        ),
    },
    {
      name: 'DND5E.Group.Action.Remove',
      icon: `<i class="fa-solid fa-trash fa-fw"></i>`,
      callback: async () => await group.system.removeMember(actor),
      condition: () =>
        group.isOwner && !FoundryAdapter.isLockedInCompendium(group),
      group: 'be-careful',
    },
  ];

  return options;
}
