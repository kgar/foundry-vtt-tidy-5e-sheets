import type { Actor5e } from 'src/types/types';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import type { Encounter5eMember } from 'src/types/group.types';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { getEncounterMemberContextOptionsQuadrone } from './tidy5e-encounter-context-menu-quadrone';

export function configureEncounterContextMenu(element: HTMLElement, app: any) {
  const memberId = element.getAttribute('data-member-uuid');
  const memberEntry = app.document.system.members.find(
    (m: Encounter5eMember) => m.uuid === memberId
  );

  const memberPromise = fromUuid(memberEntry.uuid);

  if (!memberPromise) return;

  ui.context.menuItems = getEncounterMemberContextOptionsQuadrone(
    app.document,
    memberPromise
  );

  TidyHooks.tidy5eSheetsGetEncounterMemberContextOptions(
    app.document,
    memberPromise,
    ui.context.menuItems
  );
}
