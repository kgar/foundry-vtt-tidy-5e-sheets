import type { Group5eMember } from 'src/types/group.types';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { getGroupMemberContextOptionsQuadrone } from './tidy5e-group-context-menu-quadrone';

export function configureGroupContextMenu(element: HTMLElement, app: any) {
  const memberId = element.getAttribute('data-member-id');
  const actor = app.document.system.members.find(
    (m: Group5eMember) => m.actor.id === memberId
  )?.actor;

  if (!actor) return;

  ui.context.menuItems = getGroupMemberContextOptionsQuadrone(
    app.document,
    actor
  );

  TidyHooks.tidy5eSheetsGetGroupMemberContextOptions(
    app.document,
    actor,
    ui.context.menuItems
  );
}
