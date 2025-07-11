import { JournalEntryApplication } from 'src/applications/journal/JournalEntryApplication.svelte';
import { JournalQuadrone } from 'src/features/journal/JournalQuadrone.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';

export function configureActorJournalContextMenu(
  element: HTMLElement,
  app: any
) {
  const id = element
    .closest('[data-tidy-journal-id]')
    ?.getAttribute('data-tidy-journal-id');

  if (!id) {
    return;
  }

  ui.context.menuItems = [
    {
      name: 'SIDEBAR.Edit',
      icon: '<i class="fa-solid fa-pencil-alt fa-fw"></i>',
      condition: () =>
        app.document.isOwner &&
        !FoundryAdapter.isLockedInCompendium(app.document),
      callback: () => {
        new JournalEntryApplication(id, 'edit', {
          document: app.document,
        }).render({ force: true });
      },
    },
    {
      name: 'TIDY5E.ContextMenuActionView',
      icon: '<i class="fas fa-eye fa-fw"></i>',
      callback: () => {
        new JournalEntryApplication(id, 'view', {
          document: app.document,
        }).render({ force: true });
      },
    },
    {
      name: 'SIDEBAR.Delete',
      icon: '<i class="fa-solid fa-trash"></i>',
      condition: () =>
        app.document.isOwner &&
        !FoundryAdapter.isLockedInCompendium(app.document),
      callback: () => {
        JournalQuadrone.remove(app.actor, id);
      },
    },
    {
      name: 'SIDEBAR.Duplicate',
      icon: '<i class="fa-solid fa-copy fa-fw"></i>',
      condition: () =>
        app.document.isOwner &&
        !FoundryAdapter.isLockedInCompendium(app.document),
      callback: () => {
        JournalQuadrone.duplicate(app.actor, id);
      },
    },
  ] satisfies ContextMenuEntry[];
}
