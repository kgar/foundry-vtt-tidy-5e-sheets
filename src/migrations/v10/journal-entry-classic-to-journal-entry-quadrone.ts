import { TidyFlags } from "src/foundry/TidyFlags";
import { JournalQuadrone } from 'src/features/journal/JournalQuadrone.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Actor5e } from 'src/types/types';
import { isNil } from 'src/utils/data';

type ClassicJournalEntry = {
  title: string | undefined;
  value: string | undefined;
};

export async function migrateClassicTidyJournalsToTidyQuadrone(
  actor: Actor5e,
  clearFlagData: boolean
) {
  let notes: ClassicJournalEntry[] = [
    {
      title: FoundryAdapter.localize('SIDEBAR.TabJournal'),
      value: TidyFlags.notes.get(actor)?.value,
    },
    {
      title: TidyFlags.notes1.get(actor)?.name,
      value: TidyFlags.notes1.get(actor)?.value,
    },
    {
      title: TidyFlags.notes2.get(actor)?.name,
      value: TidyFlags.notes2.get(actor)?.value,
    },
    {
      title: TidyFlags.notes3.get(actor)?.name,
      value: TidyFlags.notes3.get(actor)?.value,
    },
    {
      title: TidyFlags.notes4.get(actor)?.name,
      value: TidyFlags.notes4.get(actor)?.value,
    },
  ].filter((n) => !isNil(n.value, '') || !isNil(n.title, ''));

  for (let note of notes) {
    await JournalQuadrone.add(actor, {
      title: note.title,
      value: note.value,
    });
  }

  if (clearFlagData) {
    await TidyFlags.notes.unset(actor);
    await TidyFlags.notes1.unset(actor);
    await TidyFlags.notes2.unset(actor);
    await TidyFlags.notes3.unset(actor);
    await TidyFlags.notes4.unset(actor);
  }
}
