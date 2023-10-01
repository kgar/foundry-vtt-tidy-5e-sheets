<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type CharacterSheetContext } from 'src/types/types';
  import SheetEditor from 'src/sheets/SheetEditor.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import RerenderAfterFormSubmission from '../shared/RerenderAfterFormSubmission.svelte';
  import TextInput from '../form/TextInput.svelte';

  let store = getContext<Readable<CharacterSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  function activateProseMirrorListeners(node: HTMLElement) {
    $store.activateFoundryJQueryListeners(node);
  }
</script>

<div class="left-notes note-entries" class:limited={$store.actor.limited}>
  <RerenderAfterFormSubmission
    andOnValueChange={FoundryAdapter.tryGetFlag($store.actor, 'notes1.value') ??
      ''}
  >
    <article use:activateProseMirrorListeners>
      <div class="section-titles">
        <TextInput
          document={$store.actor}
          field="flags.{CONSTANTS.MODULE_ID}.notes1.name"
          value={FoundryAdapter.tryGetFlag($store.actor, 'notes1.name') ?? ''}
          placeholder={localize('T5EK.JournalPoi')}
          selectOnFocus={true}
          stopChangePropagation={true}
        />
      </div>
      <SheetEditor
        content={FoundryAdapter.tryGetFlag($store.actor, 'notes1.value') ?? ''}
        target="flags.{CONSTANTS.MODULE_ID}.notes1.value"
        editable={$store.owner || FoundryAdapter.userIsGm()}
      />
    </article>
  </RerenderAfterFormSubmission>
  <RerenderAfterFormSubmission
    andOnValueChange={FoundryAdapter.tryGetFlag($store.actor, 'notes2.value') ??
      ''}
  >
    <article use:activateProseMirrorListeners>
      <div class="section-titles">
        <TextInput
          document={$store.actor}
          field="flags.{CONSTANTS.MODULE_ID}.notes2.name"
          value={FoundryAdapter.tryGetFlag($store.actor, 'notes2.name') ?? ''}
          placeholder={localize('T5EK.JournalLoi')}
          selectOnFocus={true}
          stopChangePropagation={true}
        />
      </div>
      <SheetEditor
        content={FoundryAdapter.tryGetFlag($store.actor, 'notes2.value') ?? ''}
        target="flags.{CONSTANTS.MODULE_ID}.notes2.value"
        editable={$store.owner || FoundryAdapter.userIsGm()}
      />
    </article>
  </RerenderAfterFormSubmission>
  <RerenderAfterFormSubmission
    andOnValueChange={FoundryAdapter.tryGetFlag($store.actor, 'notes3.value') ??
      ''}
  >
    <article use:activateProseMirrorListeners>
      <div class="section-titles">
        <TextInput
          document={$store.actor}
          field="flags.{CONSTANTS.MODULE_ID}.notes3.name"
          value={FoundryAdapter.tryGetFlag($store.actor, 'notes3.name') ?? ''}
          placeholder={localize('T5EK.JournalQuests')}
          selectOnFocus={true}
          stopChangePropagation={true}
        />
      </div>
      <SheetEditor
        content={FoundryAdapter.tryGetFlag($store.actor, 'notes3.value') ?? ''}
        target="flags.{CONSTANTS.MODULE_ID}.notes3.value"
        editable={$store.owner || FoundryAdapter.userIsGm()}
      />
    </article>
  </RerenderAfterFormSubmission>
  <RerenderAfterFormSubmission
    andOnValueChange={FoundryAdapter.tryGetFlag($store.actor, 'notes4.value') ??
      ''}
  >
    <article use:activateProseMirrorListeners>
      <div class="section-titles">
        <TextInput
          document={$store.actor}
          field="flags.{CONSTANTS.MODULE_ID}.notes4.name"
          value={FoundryAdapter.tryGetFlag($store.actor, 'notes4.name') ?? ''}
          placeholder={localize('T5EK.JournalMisc')}
          selectOnFocus={true}
          stopChangePropagation={true}
        />
      </div>
      <SheetEditor
        content={FoundryAdapter.tryGetFlag($store.actor, 'notes4.value') ?? ''}
        target="flags.{CONSTANTS.MODULE_ID}.notes4.value"
        editable={$store.owner || FoundryAdapter.userIsGm()}
      />
    </article>
  </RerenderAfterFormSubmission>
</div>
<div class="right-notes note-entries" class:limited={$store.actor.limited}>
  <RerenderAfterFormSubmission
    andOnValueChange={FoundryAdapter.tryGetFlag($store.actor, 'notes.value') ??
      ''}
  >
    <article class="journal-notes" use:activateProseMirrorListeners>
      <div class="section-titles">{localize('T5EK.JournalEntries')}</div>
      <SheetEditor
        content={FoundryAdapter.tryGetFlag($store.actor, 'notes.value') ?? ''}
        target="flags.{CONSTANTS.MODULE_ID}.notes.value"
        editable={$store.owner || FoundryAdapter.userIsGm()}
      />
    </article>
  </RerenderAfterFormSubmission>
</div>

<style lang="scss">
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
