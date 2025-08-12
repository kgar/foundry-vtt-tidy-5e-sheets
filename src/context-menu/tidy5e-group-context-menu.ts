import type { Actor5e } from 'src/types/types';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import type { Group5eMember } from 'src/types/group.types';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export function configureGroupContextMenu(element: HTMLElement, app: any) {
  const memberId = element.getAttribute('data-member-id');
  const actor = app.document.system.members.find(
    (m: Group5eMember) => m.actor.id === memberId
  )?.actor;

  if (!actor) return;

  ui.context.menuItems = getGroupMemberContextOptions(app.document, actor);
  TidyHooks.tidy5eSheetsGetGroupMemberContextOptions(
    app.document,
    actor,
    ui.context.menuItems
  );
}

/**
 * Prepare an array of context menu options which are available for a member of a group.
 * @param group    The group for which the context menu is activated.
 * @param actor    The actor for whom the context menu is activate.
 * @returns        Context menu options.
 */
function getGroupMemberContextOptions(
  group: Actor5e,
  actor: Actor5e
): ContextMenuEntry[] {
  let options: ContextMenuEntry[] = [
    {
      name: 'DND5E.Group.Action.Remove',
      icon: `<i class="fas fa-trash fa-fw t5e-warning-color"></i>`,
      callback: async () => await group.system.removeMember(actor),
      condition: () =>
        group.isOwner && !FoundryAdapter.isLockedInCompendium(group),
    },
  ];

  return options;
}
