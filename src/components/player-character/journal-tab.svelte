<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import {
    FoundryAdapter,
    type CharacterSheetContext,
  } from 'src/foundry/foundry-adapter';
  import SheetEditor from 'src/sheets/sheet-editor.svelte';
  import { onMount } from 'svelte';

  export let context: CharacterSheetContext;

  onMount(() => console.log('onMount: journal-tab'));

  const localize = FoundryAdapter.localize;
</script>

<!-- <div class="tab journal" data-group="primary" data-tab="journal"> -->
<div class="left-notes note-entries" class:limited={context.actor.limited}>
  <article>
    <div class="section-titles">
      <input
        type="text"
        name="flags.{CONSTANTS.MODULE_ID}.notes1.name"
        value={FoundryAdapter.tryGetFlag(context.actor, 'notes1.name') ?? ''}
        placeholder={localize('T5EK.JournalPoi')}
      />
    </div>
    <SheetEditor
      content={FoundryAdapter.tryGetFlag(context.actor, 'notes1.value') ?? ''}
      target="flags.{CONSTANTS.MODULE_ID}.notes1.value"
      editable={context.owner || FoundryAdapter.userIsGm()}
    />
  </article>
  <article>
    <div class="section-titles">
      <input
        type="text"
        name="flags.{CONSTANTS.MODULE_ID}.notes2.name"
        value={FoundryAdapter.tryGetFlag(context.actor, 'notes2.name') ?? ''}
        placeholder={localize('T5EK.JournalLoi')}
      />
    </div>
    <SheetEditor
      content={FoundryAdapter.tryGetFlag(context.actor, 'notes2.value') ?? ''}
      target="flags.{CONSTANTS.MODULE_ID}.notes2.value"
      editable={context.owner || FoundryAdapter.userIsGm()}
    />
  </article>
  <article>
    <div class="section-titles">
      <input
        type="text"
        name="flags.{CONSTANTS.MODULE_ID}.notes3.name"
        value={FoundryAdapter.tryGetFlag(context.actor, 'notes3.name') ?? ''}
        placeholder={localize('T5EK.JournalQuests')}
      />
    </div>
    <SheetEditor
      content={FoundryAdapter.tryGetFlag(context.actor, 'notes3.value') ?? ''}
      target="flags.{CONSTANTS.MODULE_ID}.notes3.value"
      editable={context.owner || FoundryAdapter.userIsGm()}
    />
  </article>
  <article>
    <div class="section-titles">
      <input
        type="text"
        name="flags.{CONSTANTS.MODULE_ID}.notes4.name"
        value={FoundryAdapter.tryGetFlag(context.actor, 'notes4.name') ?? ''}
        placeholder={localize('T5EK.JournalMisc')}
      />
    </div>
    <SheetEditor
      content={FoundryAdapter.tryGetFlag(context.actor, 'notes4.value') ?? ''}
      target="flags.{CONSTANTS.MODULE_ID}.notes4.value"
      editable={context.owner || FoundryAdapter.userIsGm()}
    />
  </article>
</div>
<div class="right-notes note-entries" class:limited={context.actor.limited}>
  <article class="journal-notes">
    <div class="section-titles">{localize('T5EK.JournalEntries')}</div>
    <SheetEditor
      content={FoundryAdapter.tryGetFlag(context.actor, 'notes.value') ?? ''}
      target="flags.{CONSTANTS.MODULE_ID}.notes.value"
      editable={context.owner || FoundryAdapter.userIsGm()}
    />
  </article>
</div>

<!-- </div> -->

<style lang="scss">
  .left-notes,
  .right-notes {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .left-notes {
    margin-right: 1rem;
    max-width: 21.875rem;
  }
</style>
