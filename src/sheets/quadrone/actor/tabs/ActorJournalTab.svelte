<script lang="ts">
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';
  import { TidyFlags, type ActorJournalEntry } from 'src/api';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSheetQuadroneContext } from 'src/types/types';
  import { isNil } from 'src/utils/data';
  import { coalesce } from 'src/utils/formatting';

  let context = $derived(getSheetContext<ActorSheetQuadroneContext>());

  let entries = $derived(
    Object.values(TidyFlags.actorJournal.get(context.actor)).toSorted(
      (a, b) => a.sort - b.sort,
    ),
  );

  let selectedIndex = $state(0);

  let selected = $derived<ActorJournalEntry | undefined>(
    entries[selectedIndex],
  );
  let journalProp = $derived(
    selected ? `${TidyFlags.actorJournal.prop}.${selected.id}` : '',
  );
  let editing = $state<boolean>(false);
  let enrichedPromise = $derived(
    !isNil(selected?.value)
      ? foundry.applications.ux.TextEditor.enrichHTML(selected.value, {
          secrets: context.owner,
          rollData: context.rollData,
          relativeTo: context.actor,
        })
      : Promise.resolve(''),
  );

  $effect(() => {
    if (selectedIndex >= entries.length) {
      selectedIndex = Math.min(0, selectedIndex - 1);
    }
  });

  // TODO: Eliminate this, if possible
  function getFallbackTitle(index: number) {
    return `(localize) Journal Entry ${index + 1}`;
  }

  const localize = FoundryAdapter.localize;
</script>

{#if editing && selected}
  {#await enrichedPromise then enriched}
    <div class="journal-editor">
      <SheetEditorV2
        documentUuid={context.document.uuid}
        content={selected.value}
        editorOptions={{ toggled: false }}
        manageSecrets={true}
        field="{journalProp}.value"
        {enriched}
        onSave={() => (editing = false)}
      />
    </div>
  {/await}
{/if}

<div class={['journal-entry-selector', { hidden: editing }]}>
  <nav class="pages-list">
    <ol class="">
      {#each entries as entry, i (entry.id)}
        <li
          class={['page', { selected: i === selectedIndex }]}
          onclick={() => i !== selectedIndex && (selectedIndex = i)}
          data-journal-id={entry.id}
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
        await TidyFlags.actorJournal.add(context.actor);
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
<div class={['journal-entry-viewer', { hidden: editing }]}>
  {#if selected}
    {@const title = coalesce(selected.title, getFallbackTitle(selectedIndex))}

    <div class="title-container">
      {#if context.unlocked}
        <TextInputQuadrone
          document={context.actor}
          field={`${journalProp}.title`}
          value={selected.title}
          placeholder={title}
          class="title"
        />
      {:else}
        <h3 class="title">{title}</h3>
      {/if}
      <a
        class="button button-borderless button-icon-only edit"
        onclick={() => (editing = true)}><i class="fa-solid fa-feather"></i></a
      >
    </div>
    {#await enrichedPromise then enriched}
      <div class="editor" use:manageSecrets={{ document: context.document }}>
        <div
          data-field={selected
            ? `${TidyFlags.actorJournal.prop}.${selected.id}.value`
            : ''}
          class="user-select-text"
        >
          {@html enriched}
        </div>
      </div>
    {/await}
  {/if}
</div>
