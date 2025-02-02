import type { Actor5e } from 'src/types/types';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import type { Group5eMember } from 'src/types/group.types';
import { TidyHooks } from 'src/foundry/TidyHooks';

export function configureGroupContextMenu(element: HTMLElement, app: any) {
  const memberId = element.getAttribute('data-member-id');
  const actor = app.document.system.members.find(
    (m: Group5eMember) => m.actor.id === memberId
  );

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
function getGroupMemberContextOptions(group: Actor5e, actor: Actor5e) {
  let options: ContextMenuEntry[] = [
    {
      name: 'TIDY5E.Group.RemoveMemberFromGroup',
      icon: `<i class="fas fa-trash fa-fw t5e-warning-color"></i>`,
      callback: () => group.removeMember(actor.id),
      condition: () => !group.compendium?.locked,
    },
  ];

  return options;
}
