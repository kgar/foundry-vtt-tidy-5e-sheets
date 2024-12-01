<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type CharacterSheetContext } from 'src/types/types';
  import SheetEditor from 'src/components/editor/SheetEditor.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import RerenderAfterFormSubmission from '../../../../components/utility/RerenderAfterFormSubmission.svelte';
  import TextInput from '../../../../components/inputs/TextInput.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { CONSTANTS } from 'src/constants';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  let editing = $state(false);
  let contentToEdit: string = $state();
  let enrichedText: string = $state();
  let fieldToEdit: string = $state();

  async function stopEditing() {
    await $context.actor.sheet.submit();
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
            editable: $context.editable,
            toggled: false,
          }}
          documentUuid={$context.actor.uuid}
          on:save={() => stopEditing()}
          manageSecrets={$context.actor.isOwner}
        />
      </article>
    {/key}
  {/if}
  <div
    class="left-notes note-entries hide-editor-edit"
    class:hidden={editing}
    class:limited={$context.showLimitedSheet}
  >
    <RerenderAfterFormSubmission
      andOnValueChange={TidyFlags.notes1.members.value.get($context.actor) ??
        ''}
    >
      <article use:$context.activateEditors>
        <div class="section-titles flex-row">
          <TextInput
            document={$context.actor}
            field={TidyFlags.notes1.members.name.prop}
            value={TidyFlags.notes1.members.name.get($context.actor) ?? ''}
            placeholder={localize('TIDY5E.JournalPersonsOfInterest')}
            selectOnFocus={true}
            stopChangePropagation={true}
            disabled={!$context.editable}
          />
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_missing_attribute -->
          <a
            class="icon-button"
            onclick={(ev) =>
              $context.editable &&
              edit(
                TidyFlags.notes1.members.value.get($context.actor) ?? '',
                $context.notes1EnrichedHtml,
                TidyFlags.notes1.members.value.prop,
              )}
          >
            <i class="fa-solid fa-feather"></i>
          </a>
        </div>
        <SheetEditor
          content={$context.notes1EnrichedHtml}
          target={TidyFlags.notes1.members.value.prop}
          editable={$context.editable}
        />
      </article>
    </RerenderAfterFormSubmission>
    <RerenderAfterFormSubmission
      andOnValueChange={TidyFlags.notes2.members.value.get($context.actor) ??
        ''}
    >
      <article use:$context.activateEditors>
        <div class="section-titles flex-row">
          <TextInput
            document={$context.actor}
            field={TidyFlags.notes2.members.name.prop}
            value={TidyFlags.notes2.members.name.get($context.actor) ?? ''}
            placeholder={localize('TIDY5E.JournalLocationsOfInterest')}
            selectOnFocus={true}
            stopChangePropagation={true}
            disabled={!$context.editable}
          />
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_missing_attribute -->
          <a
            class="icon-button"
            onclick={(ev) =>
              $context.editable &&
              edit(
                TidyFlags.notes2.members.value.get($context.actor) ?? '',
                $context.notes2EnrichedHtml,
                TidyFlags.notes2.members.value.prop,
              )}
          >
            <i class="fa-solid fa-feather"></i>
          </a>
        </div>
        <SheetEditor
          content={$context.notes2EnrichedHtml}
          target={TidyFlags.notes2.members.value.prop}
          editable={$context.editable}
        />
      </article>
    </RerenderAfterFormSubmission>
    <RerenderAfterFormSubmission
      andOnValueChange={TidyFlags.notes3.members.value.get($context.actor) ??
        ''}
    >
      <article use:$context.activateEditors>
        <div class="section-titles flex-row">
          <TextInput
            document={$context.actor}
            field={TidyFlags.notes3.members.name.prop}
            value={TidyFlags.notes3.members.name.get($context.actor) ?? ''}
            placeholder={localize('TIDY5E.JournalQuests')}
            selectOnFocus={true}
            stopChangePropagation={true}
            disabled={!$context.editable}
          />
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_missing_attribute -->
          <a
            class="icon-button"
            onclick={(ev) =>
              $context.editable &&
              edit(
                TidyFlags.notes3.members.value.get($context.actor) ?? '',
                $context.notes3EnrichedHtml,
                TidyFlags.notes3.members.value.prop,
              )}
          >
            <i class="fa-solid fa-feather"></i>
          </a>
        </div>
        <SheetEditor
          content={$context.notes3EnrichedHtml}
          target={TidyFlags.notes3.members.value.prop}
          editable={$context.editable}
        />
      </article>
    </RerenderAfterFormSubmission>
    <RerenderAfterFormSubmission
      andOnValueChange={TidyFlags.notes4.members.value.get($context.actor) ??
        ''}
    >
      <article use:$context.activateEditors>
        <div class="section-titles flex-row">
          <TextInput
            document={$context.actor}
            field={TidyFlags.notes4.members.name.prop}
            value={TidyFlags.notes4.members.name.get($context.actor) ?? ''}
            placeholder={localize('TIDY5E.JournalMisc')}
            selectOnFocus={true}
            stopChangePropagation={true}
            disabled={!$context.editable}
          />
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_missing_attribute -->
          <a
            class="icon-button"
            onclick={(ev) =>
              $context.editable &&
              edit(
                TidyFlags.notes4.members.value.get($context.actor) ?? '',
                $context.notes4EnrichedHtml,
                TidyFlags.notes4.members.value.prop,
              )}
          >
            <i class="fa-solid fa-feather"></i>
          </a>
        </div>
        <SheetEditor
          content={$context.notes4EnrichedHtml}
          target={TidyFlags.notes4.members.value.prop}
          editable={$context.editable}
        />
      </article>
    </RerenderAfterFormSubmission>
  </div>
  <div
    class="right-notes note-entries hide-editor-edit"
    class:hidden={editing}
    class:limited={$context.showLimitedSheet}
  >
    <RerenderAfterFormSubmission
      andOnValueChange={TidyFlags.notes.members.value.get($context.actor) ?? ''}
    >
      <article class="journal-notes" use:$context.activateEditors>
        <div class="section-titles flex-row justify-content-space-between">
          <span>
            {localize('TIDY5E.JournalEntries')}
          </span>
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <!-- svelte-ignore a11y_missing_attribute -->
          <a
            class="icon-button"
            onclick={(ev) =>
              $context.editable &&
              edit(
                TidyFlags.notes.members.value.get($context.actor) ?? '',
                $context.notesEnrichedHtml,
                TidyFlags.notes.members.value.prop,
              )}
          >
            <i class="fa-solid fa-feather"></i>
          </a>
        </div>
        <SheetEditor
          content={$context.notesEnrichedHtml}
          target={TidyFlags.notes.members.value.prop}
          editable={$context.editable}
        />
      </article>
    </RerenderAfterFormSubmission>
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
