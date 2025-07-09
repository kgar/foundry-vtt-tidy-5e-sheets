import { TidyFlags, type DocumentJournalEntry } from 'src/api';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export class JournalQuadrone {
  static async add(doc: any, data?: Partial<DocumentJournalEntry>) {
    const newId = foundry.utils.randomID();

    const newSort = this.getMaxSort(doc) + 10;

    const updateProp = `${TidyFlags.getFlagPropertyPath(
      TidyFlags.documentJournal.key
    )}.${newId}`;

    await doc.update({
      [updateProp]: {
        title: FoundryAdapter.localize('DOCUMENT.New', {
          type: FoundryAdapter.localize('DOCUMENT.JournalEntry'),
        }),
        value: '',
        ...data,
        id: newId,
        sort: newSort,
      } satisfies DocumentJournalEntry,
    });

    return newId;
  }

  static duplicate(doc: any, id: string) {
    const original = TidyFlags.documentJournal.get(doc)[id];

    if (!original) {
      return;
    }

    const newId = foundry.utils.randomID();

    const newEntry = {
      ...original,
      title: FoundryAdapter.localize('DOCUMENT.CopyOf', {
        name: original.title,
      }),
      id: newId,
    } satisfies DocumentJournalEntry;

    return this.add(doc, newEntry);
  }

  static sort(doc: any, sourceId: string, targetId: string) {
    if (sourceId === targetId) return;

    const journal = TidyFlags.documentJournal.get(doc);

    let source;
    let target;
    let siblings = Object.values(journal).filter((e) => {
      if (e.id === targetId) target = e;
      else if (e.id === sourceId) source = e;
      return e.id !== sourceId;
    });

    if (!source || !target) {
      return;
    }

    const updates = foundry.utils.SortingHelpers.performIntegerSort(source, {
      target,
      siblings,
    });

    let docUpdates: Record<string, { sort: number }> = {};

    for (const { target, update } of updates) {
      docUpdates[
        `${TidyFlags.getFlagPropertyPath(TidyFlags.documentJournal.key)}.${
          target.id
        }`
      ] = { sort: update.sort };
    }

    return doc.update(docUpdates);
  }

  static getMaxSort(doc: any) {
    return Object.values(TidyFlags.documentJournal.get(doc)).reduce(
      (prev, acc) => {
        return Math.max(prev, acc.sort ?? 0);
      },
      0
    );
  }

  static remove(doc: any, id: string) {
    // Delete any entry whose key or value.id matches the ID param.
    const journal = TidyFlags.documentJournal.get(doc);
    const deletions = Object.entries(journal)
      .filter(([key, entry]) => key === id || entry.id === id)
      .map(([key]) => {
        return `${TidyFlags.getFlagPropertyPath(
          TidyFlags.documentJournal.key
        )}.-=${key}`;
      })
      .reduce<Record<string, null>>((prev, curr) => {
        prev[curr] = null;
        return prev;
      }, {});

    return doc.update(deletions);
  }
}
