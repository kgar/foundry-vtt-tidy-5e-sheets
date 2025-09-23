import { TidyFlags, TidyHooks } from 'src/api';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import type { Actor5e } from 'src/types/types';

export function configureEncounterPlaceholderContextMenu(
  element: HTMLElement,
  app: any
) {
  const placeholderId = element.getAttribute('data-placeholder-id');

  if (!placeholderId) {
    return;
  }

  ui.context.menuItems = getEncounterPlaceholderContextOptionsQuadrone(
    app.document,
    placeholderId
  );

  TidyHooks.tidy5eSheetsGetEncounterMemberContextOptions(
    app.document,
    placeholderId,
    ui.context.menuItems
  );
}
function getEncounterPlaceholderContextOptionsQuadrone(
  encounter: Actor5e,
  placeholderId: string
): ContextMenuEntry[] {
  let options: ContextMenuEntry[] = [
    {
      name: 'TIDY5E.Encounter.DeletePlaceholder.Label',
      icon: `<i class="fas fa-trash fa-fw"></i>`,
      callback: async () =>
        TidyFlags.placeholders.deleteEntry(encounter, placeholderId),
      condition: () =>
        encounter.isOwner && !FoundryAdapter.isLockedInCompendium(encounter),
    },
  ];

  return options;
}
