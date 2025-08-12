import type { Actor5e } from 'src/types/types';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import type { Encounter5eMember } from 'src/types/group.types';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export function configureEncounterContextMenu(element: HTMLElement, app: any) {
  const memberId = element.getAttribute('data-member-uuid');
  const memberEntry = app.document.system.members.find(
    (m: Encounter5eMember) => m.uuid === memberId
  );

  const memberPromise = fromUuid(memberEntry.uuid);

  if (!memberPromise) return;

  ui.context.menuItems = getEncounterMemberContextOptions(
    app.document,
    memberPromise
  );
  TidyHooks.tidy5eSheetsGetEncounterMemberContextOptions(
    app.document,
    memberPromise,
    ui.context.menuItems
  );
}

/**
 * Prepare an array of context menu options which are available for a member of an encounter.
 * @param encounter    The encounter for which the context menu is activated.
 * @param memberPromise    The actor for whom the context menu is activate.
 * @returns        Context menu options.
 */
function getEncounterMemberContextOptions(
  encounter: Actor5e,
  memberPromise: Promise<Actor5e>
): ContextMenuEntry[] {
  let options: ContextMenuEntry[] = [
    {
      name: 'DND5E.Group.Action.Remove',
      icon: `<i class="fas fa-trash fa-fw t5e-warning-color"></i>`,
      callback: async () =>
        await encounter.system.removeMember(await memberPromise),
      condition: () =>
        encounter.isOwner && !FoundryAdapter.isLockedInCompendium(encounter),
    },
  ];

  return options;
}
