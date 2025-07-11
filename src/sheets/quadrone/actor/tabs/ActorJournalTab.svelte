<script lang="ts">
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';
  import { type DocumentJournalEntry } from 'src/foundry/TidyFlags.types';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { JournalEntryApplication } from 'src/applications/journal/JournalEntryApplication.svelte';
  import type { TabStripInfo } from 'src/components/tabs/Tabs.svelte';
  import VerticalTabs from 'src/components/tabs/VerticalTabs.svelte';
  import { CONSTANTS } from 'src/constants';
  import { JournalQuadrone } from 'src/features/journal/JournalQuadrone.svelte';
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

  let selectedTabId = $state('');

  $effect(() => {
    if (selectedTabId === '' && entries.length) {
      selectedTabId = entries[0].id;
    }
  });

  let selected = $derived<DocumentJournalEntry | undefined>(
    entries.find((e) => e.id === selectedTabId) ?? entries[0],
  );

  const selectedIndex = $derived<number>(
    entries.findIndex((e) => e.id === selectedTabId) ?? 0,
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

      const selectedIndex = entries.findIndex((e) => e.id === selectedTabId);

      // Handle index out of bounds, or new entry was created
      if (
        selectedIndex >= entries.length ||
        entriesLength > prev ||
        selectedIndex === -1
      ) {
        selectedTabId = entries[entries.length - 1]?.id;
      }
    },
  );

  // TODO: Eliminate this, if possible
  function getFallbackTitle(index: number) {
    return localize('TIDY5E.JournalEntry.NewTitle', { number: index + 1 });
  }

  function edit(journalId: string) {
    new JournalEntryApplication(journalId, 'edit', {
      document: context.actor,
    }).render({ force: true });
  }

  const localize = FoundryAdapter.localize;

  let tabs = $derived(
    entries.map<TabStripInfo>((entry, i) => ({
      id: entry.id,
      title: coalesce(entry.title, getFallbackTitle(i)),
      attributes: {
        ['data-tidy-draggable']: '',
        ['data-tidy-journal-id']: entry.id,
        ['data-context-menu']: CONSTANTS.CONTEXT_MENU_TYPE_ACTOR_JOURNAL,
      },
    })),
  );
</script>

<div class={['journal-entry-selector']}>
  <VerticalTabs {tabs} bind:selectedTabId includeTabNumber />
  <div class="action-buttons">
    <button
      type="button"
      aria-label={localize('JOURNAL.PrevPage')}
      class="button button-icon-only"
      data-tooltip="JOURNAL.PrevPage"
      disabled={!selected || selectedIndex <= 0}
      onclick={() => (selectedTabId = entries[selectedIndex - 1]?.id)}
    >
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    <button
      type="button"
      aria-label={localize('JOURNAL.AddPage')}
      class="button add"
      disabled={!context.owner}
      onclick={async () => {
        const newId = await JournalQuadrone.add(context.actor);
        edit(newId);
      }}
    >
      <i class="fa-solid fa-file-circle-plus"></i>
      {localize('JOURNAL.AddPage')}
    </button>
    <button
      type="button"
      aria-label={localize('JOURNAL.NextPage')}
      class="button button-icon-only"
      data-tooltip="JOURNAL.NextPage"
      disabled={!selected || selectedIndex >= entries.length - 1}
      onclick={() => (selectedTabId = entries[selectedIndex + 1]?.id)}
    >
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  </div>
</div>
<div class={['journal-entry-viewer']}>
  {#if selected}
    {@const title = coalesce(selected.title, getFallbackTitle(selectedIndex))}

    <div class="title-container">
      <h2 class="title flexrow">
        <span class="flex1">{title}</span>
        <a
          class="button button-borderless button-icon-only edit flexshrink"
          onclick={() => edit(selected.id)}
          ><i class="fa-solid fa-feather"></i></a
        >
      </h2>
      <tidy-gold-header-underline></tidy-gold-header-underline>
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
