<script lang="ts">
  import type {
    JournalEntryApplication,
    JournalMode,
  } from './JournalEntryApplication.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import type { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import type { DocumentJournalEntry } from 'src/foundry/TidyFlags.types';

  interface Props {
    entry: CoarseReactivityProvider<DocumentJournalEntry | undefined>;
    app: JournalEntryApplication;
    mode: JournalMode;
  }

  let { entry, app, mode }: Props = $props();

  const localize = FoundryAdapter.localize;

  let title = $derived(entry.data?.title ?? '');
  let value = $derived(entry.data?.value ?? '');

  let baseField = $derived(
    entry ? `${TidyFlags.documentJournal.prop}.${entry.data?.id}` : '',
  );

  let rollData = $derived(app.document.getRollData());

  let enrichedPromise = $derived(
    foundry.applications.ux.TextEditor.enrichHTML(value, {
      secrets: rollData.owner,
      rollData: rollData.rollData,
      relativeTo: rollData.actor,
    }),
  );

  $effect(() => {
    if (!entry?.data?.id) {
      app.close({
        bypassSubmitOnClose: true,
      });
    }
  });
</script>

{#if entry.data}
  {#if mode === 'edit'}
    <TextInputQuadrone
      document={app.document}
      field="{baseField}.title"
      value={title}
      class="journal-page-title-input h2"
      placeholder={localize('JOURNAL.EntryTitle')}
    />

    {#await enrichedPromise then enriched}
      <div class="flexible-editor-container flex1">
        <SheetEditorV2
          documentUuid={app.document.uuid}
          content={value}
          editorOptions={{ toggled: false }}
          manageSecrets={true}
          field="{baseField}.value"
          {enriched}
        />
      </div>
    {/await}
  {:else}
    <h2 class="journal-page-title">
      {entry.data?.title}
    </h2>

    {#await enrichedPromise then enriched}
      <div class="editor" use:manageSecrets={{ document: app.document }}>
        <div data-field="{baseField}.value" class="user-select-text">
          {@html enriched}
        </div>
      </div>
    {/await}
  {/if}
{/if}
