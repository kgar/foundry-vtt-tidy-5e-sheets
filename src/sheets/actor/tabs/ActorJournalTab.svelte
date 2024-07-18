<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type CharacterSheetContext } from 'src/types/types';
  import SheetEditor from 'src/components/editor/SheetEditor.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import RerenderAfterFormSubmission from '../../../components/utility/RerenderAfterFormSubmission.svelte';
  import TextInput from '../../../components/inputs/TextInput.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';

  let context = getContext<Readable<CharacterSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<div class="scroll-container journal-container">
  <div
    class="left-notes note-entries"
    class:limited={$context.showLimitedSheet}
  >
    <RerenderAfterFormSubmission
      andOnValueChange={TidyFlags.notes1.members.value.get($context.actor) ??
        ''}
    >
      <article use:$context.activateEditors>
        <div class="section-titles">
          <TextInput
            document={$context.actor}
            field={TidyFlags.notes1.members.name.prop}
            value={TidyFlags.notes1.members.name.get($context.actor) ?? ''}
            placeholder={localize('TIDY5E.JournalPersonsOfInterest')}
            selectOnFocus={true}
            stopChangePropagation={true}
            disabled={!$context.editable}
          />
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
        <div class="section-titles">
          <TextInput
            document={$context.actor}
            field={TidyFlags.notes2.members.name.prop}
            value={TidyFlags.notes2.members.name.get($context.actor) ?? ''}
            placeholder={localize('TIDY5E.JournalLocationsOfInterest')}
            selectOnFocus={true}
            stopChangePropagation={true}
            disabled={!$context.editable}
          />
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
        <div class="section-titles">
          <TextInput
            document={$context.actor}
            field={TidyFlags.notes3.members.name.prop}
            value={TidyFlags.notes3.members.name.get($context.actor) ?? ''}
            placeholder={localize('TIDY5E.JournalQuests')}
            selectOnFocus={true}
            stopChangePropagation={true}
            disabled={!$context.editable}
          />
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
        <div class="section-titles">
          <TextInput
            document={$context.actor}
            field={TidyFlags.notes4.members.name.prop}
            value={TidyFlags.notes4.members.name.get($context.actor) ?? ''}
            placeholder={localize('TIDY5E.JournalMisc')}
            selectOnFocus={true}
            stopChangePropagation={true}
            disabled={!$context.editable}
          />
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
    class="right-notes note-entries"
    class:limited={$context.showLimitedSheet}
  >
    <RerenderAfterFormSubmission
      andOnValueChange={TidyFlags.notes.members.value.get($context.actor) ?? ''}
    >
      <article class="journal-notes" use:$context.activateEditors>
        <div class="section-titles">{localize('TIDY5E.JournalEntries')}</div>
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
    gap: 1rem;
  }

  .left-notes,
  .right-notes {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .left-notes {
    max-width: 21.875rem;
  }
</style>
