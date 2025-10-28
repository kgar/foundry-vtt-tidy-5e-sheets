<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TextInput from '../../../../components/inputs/TextInput.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';

  let context = $derived(getCharacterSheetContext());

  let editing = $state(false);
  let contentToEdit: string = $state('');
  let enrichedText: string = $state('');
  let fieldToEdit: string = $state('');

  async function stopEditing() {
    editing = false;
  }

  function edit(value: string, enriched: string, field: string) {
    contentToEdit = value;
    fieldToEdit = field;
    enrichedText = enriched;
    editing = true;
  }

  const localize = FoundryAdapter.localize;
</script>

<div class="scroll-container journal-container">
  {#if editing}
    {#key contentToEdit}
      <article class="editor-container flex-column full-height singleton">
        <SheetEditorV2
          enriched={enrichedText}
          content={contentToEdit}
          field={fieldToEdit}
          editorOptions={{
            editable: context.editable,
            toggled: false,
          }}
          documentUuid={context.actor.uuid}
          onSave={() => stopEditing()}
          manageSecrets={context.actor.isOwner}
        />
      </article>
    {/key}
  {/if}
  <div
    class="left-notes note-entries hide-editor-edit"
    class:hidden={editing}
    class:limited={context.showLimitedSheet}
  >
    <article>
      <div class="section-titles flex-row">
        <TextInput
          document={context.actor}
          field={TidyFlags.notes1.members.name.prop}
          value={TidyFlags.notes1.members.name.get(context.actor) ?? ''}
          placeholder={localize('TIDY5E.JournalPersonsOfInterest')}
          selectOnFocus={true}
          stopChangePropagation={true}
          disabled={!context.editable}
        />
        <a
          class="icon-button"
          onclick={(ev) =>
            context.editable &&
            edit(
              TidyFlags.notes1.members.value.get(context.actor) ?? '',
              context.notes1EnrichedHtml,
              TidyFlags.notes1.members.value.prop,
            )}
        >
          <i class="fa-solid fa-feather"></i>
        </a>
      </div>
      {#key context.notes1EnrichedHtml}
        <div class="editor" use:manageSecrets={{ document: context.document }}>
          <div
            data-field={TidyFlags.notes1.members.value.prop}
            class="user-select-text"
          >
            {@html context.notes1EnrichedHtml}
          </div>
        </div>
      {/key}
    </article>
    <article>
      <div class="section-titles flex-row">
        <TextInput
          document={context.actor}
          field={TidyFlags.notes2.members.name.prop}
          value={TidyFlags.notes2.members.name.get(context.actor) ?? ''}
          placeholder={localize('TIDY5E.JournalLocationsOfInterest')}
          selectOnFocus={true}
          stopChangePropagation={true}
          disabled={!context.editable}
        />
        <a
          class="icon-button"
          onclick={(ev) =>
            context.editable &&
            edit(
              TidyFlags.notes2.members.value.get(context.actor) ?? '',
              context.notes2EnrichedHtml,
              TidyFlags.notes2.members.value.prop,
            )}
        >
          <i class="fa-solid fa-feather"></i>
        </a>
      </div>
      {#key context.notes2EnrichedHtml}
        <div class="editor" use:manageSecrets={{ document: context.document }}>
          <div
            data-field={TidyFlags.notes2.members.value.prop}
            class="user-select-text"
          >
            {@html context.notes2EnrichedHtml}
          </div>
        </div>
      {/key}
    </article>
    <article>
      <div class="section-titles flex-row">
        <TextInput
          document={context.actor}
          field={TidyFlags.notes3.members.name.prop}
          value={TidyFlags.notes3.members.name.get(context.actor) ?? ''}
          placeholder={localize('TIDY5E.JournalQuests')}
          selectOnFocus={true}
          stopChangePropagation={true}
          disabled={!context.editable}
        />
        <a
          class="icon-button"
          onclick={(ev) =>
            context.editable &&
            edit(
              TidyFlags.notes3.members.value.get(context.actor) ?? '',
              context.notes3EnrichedHtml,
              TidyFlags.notes3.members.value.prop,
            )}
        >
          <i class="fa-solid fa-feather"></i>
        </a>
      </div>
      {#key context.notes3EnrichedHtml}
        <div class="editor" use:manageSecrets={{ document: context.document }}>
          <div
            data-field={TidyFlags.notes3.members.value.prop}
            class="user-select-text"
          >
            {@html context.notes3EnrichedHtml}
          </div>
        </div>
      {/key}
    </article>
    <article>
      <div class="section-titles flex-row">
        <TextInput
          document={context.actor}
          field={TidyFlags.notes4.members.name.prop}
          value={TidyFlags.notes4.members.name.get(context.actor) ?? ''}
          placeholder={localize('TIDY5E.JournalMisc')}
          selectOnFocus={true}
          stopChangePropagation={true}
          disabled={!context.editable}
        />
        <a
          class="icon-button"
          onclick={(ev) =>
            context.editable &&
            edit(
              TidyFlags.notes4.members.value.get(context.actor) ?? '',
              context.notes4EnrichedHtml,
              TidyFlags.notes4.members.value.prop,
            )}
        >
          <i class="fa-solid fa-feather"></i>
        </a>
      </div>
      {#key context.notes4EnrichedHtml}
        <div class="editor" use:manageSecrets={{ document: context.document }}>
          <div
            data-field={TidyFlags.notes4.members.value.prop}
            class="user-select-text"
          >
            {@html context.notes4EnrichedHtml}
          </div>
        </div>
      {/key}
    </article>
  </div>
  <div
    class="right-notes note-entries hide-editor-edit"
    class:hidden={editing}
    class:limited={context.showLimitedSheet}
  >
    <article class="journal-notes">
      <div class="section-titles flex-row justify-content-space-between">
        <span>
          {localize('TIDY5E.JournalEntries')}
        </span>
        <a
          class="icon-button"
          onclick={(ev) =>
            context.editable &&
            edit(
              TidyFlags.notes.members.value.get(context.actor) ?? '',
              context.notesEnrichedHtml,
              TidyFlags.notes.members.value.prop,
            )}
        >
          <i class="fa-solid fa-feather"></i>
        </a>
      </div>
      {#key context.notesEnrichedHtml}
        <div class="editor" use:manageSecrets={{ document: context.document }}>
          <div
            data-field={TidyFlags.notes.members.value.prop}
            class="user-select-text"
          >
            {@html context.notesEnrichedHtml}
          </div>
        </div>
      {/key}
    </article>
  </div>
</div>

<style lang="scss">
  .journal-container {
    display: flex;
    align-items: flex-start;
    flex-direction: row;
    overflow-x: inherit;
    gap: 0.5rem;
  }

  .left-notes,
  .right-notes {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    > * {
      flex: 1;
      overflow: auto;
    }
  }

  .left-notes {
    max-width: 21.875rem;
  }

  .singleton {
    flex: 1;

    & :global(.editor.prosemirror) {
      flex: 1;
    }
  }
</style>
