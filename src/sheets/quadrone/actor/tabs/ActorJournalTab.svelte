<script lang="ts">
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';
  import { TidyFlags, type DocumentJournalEntry } from 'src/api';
  import { JournalEntryApplication } from 'src/applications/journal/JournalEntryApplication.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSheetQuadroneContext } from 'src/types/types';
  import { isNil } from 'src/utils/data';
  import { coalesce } from 'src/utils/formatting';
  import { watch } from 'src/utils/reactivity.svelte';

  let context = $derived(getSheetContext<ActorSheetQuadroneContext>());

  let entries = $derived(
    Object.values(TidyFlags.documentJournal.get(context.actor)).toSorted(
      (a, b) => a.sort - b.sort,
    ),
  );

  let selectedIndex = $state(0);

  let selected = $derived<DocumentJournalEntry | undefined>(
    entries[selectedIndex],
  );

  let enrichedPromise = $derived(
    !isNil(selected?.value)
      ? foundry.applications.ux.TextEditor.enrichHTML(selected.value, {
          secrets: context.owner,
          rollData: context.rollData,
          relativeTo: context.actor,
        })
      : Promise.resolve(''),
  );

  let entriesLength = $derived(entries.length);

  watch<number>(
    () => entriesLength,
    (prev) => {
      if (isNil(prev) || prev === entries.length) {
        return;
      }

      // Handle index out of bounds
      if (selectedIndex >= entries.length) {
        selectedIndex = selectedIndex - 1;
      }
      // Handle adding new entry
      else if (entriesLength > prev) {
        selectedIndex = entries.length - 1;
      }
    },
  );

  // TODO: Eliminate this, if possible
  function getFallbackTitle(index: number) {
    return `(localize) Journal Entry ${index + 1}`;
  }

  function edit(journalId: string) {
    new JournalEntryApplication(journalId, 'edit', {
      document: context.actor,
    }).render({ force: true });
  }

  const localize = FoundryAdapter.localize;
</script>

<div class={['journal-entry-selector']}>
  <nav class="pages-list">
    <ol class="pages">
      {#each entries as entry, i (entry.id)}
        <li
          class={['page', { selected: i === selectedIndex }]}
          onclick={() => i !== selectedIndex && (selectedIndex = i)}
          data-tidy-draggable
          data-tidy-journal-id={entry.id}
          data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ACTOR_JOURNAL}
        >
          {coalesce(entry.title, getFallbackTitle(i))}
        </li>
      {/each}
    </ol>
  </nav>
  <div class="action-buttons">
    <button
      type="button"
      class="button"
      data-tooltip="JOURNAL.PrevPage"
      disabled={!selected || selectedIndex <= 0}
      onclick={() => (selectedIndex -= 1)}
    >
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    <button
      type="button"
      class="button add"
      disabled={!context.owner}
      onclick={async () => {
        const newId = await TidyFlags.documentJournal.add(context.actor);
        edit(newId);
      }}
    >
      <i class="fa-solid fa-file-circle-plus"></i>
      {localize('JOURNAL.AddPage')}
    </button>
    <button
      type="button"
      class="button"
      data-tooltip="JOURNAL.NextPage"
      disabled={!selected || selectedIndex >= entries.length - 1}
      onclick={() => (selectedIndex += 1)}
    >
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  </div>
</div>
<div class={['journal-entry-viewer']}>
  {#if selected}
    {@const title = coalesce(selected.title, getFallbackTitle(selectedIndex))}

    <div class="title-container">
      <h2 class="title">{title}</h2>
      <a
        class="button button-borderless button-icon-only edit"
        onclick={() => edit(selected.id)}><i class="fa-solid fa-feather"></i></a
      >
    </div>
    {#await enrichedPromise then enriched}
      <div class="editor" use:manageSecrets={{ document: context.document }}>
        <div
          data-field={selected
            ? `${TidyFlags.documentJournal.prop}.${selected.id}.value`
            : ''}
          class="user-select-text"
        >
          {@html enriched}
        </div>
      </div>
    {/await}
  {/if}
</div>
