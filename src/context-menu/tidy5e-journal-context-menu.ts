import { TidyFlags } from 'src/api';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';

export function configureActorJournalContextMenu(
  element: HTMLElement,
  app: any
) {
  const id = element
    .closest('[data-journal-id]')
    ?.getAttribute('data-journal-id');

  if (!id) {
    return;
  }

  ui.context.menuItems = [
    {
      name: 'Delete',
      icon: '<i class="fa-solid fa-trash"></i>',
      callback: () => {
        TidyFlags.actorJournal.remove(app.actor, id);
      },
    },
    {
      name: 'Duplicate',
      icon: '<i class="fa-solid fa-copy"></i>',
      callback: () => {
        TidyFlags.actorJournal.duplicate(app.actor, id);
      },
    },
  ] satisfies ContextMenuEntry[];
}
