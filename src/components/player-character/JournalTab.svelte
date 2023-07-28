<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type ActorSheetContext } from 'src/types/types';
  import SheetEditor from 'src/sheets/SheetEditor.svelte';
  import { submitText } from 'src/sheets/form';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import RerenderAfterFormSubmission from '../shared/RerenderAfterFormSubmission.svelte';

  let store = getContext<Readable<ActorSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  function activateProseMirrorListeners(node: HTMLElement) {
    $store.activateFoundryJQueryListeners(node);
  }
</script>

<RerenderAfterFormSubmission>
  <div
    use:activateProseMirrorListeners
    class="left-notes note-entries"
    class:limited={$store.actor.limited}
  >
    <article>
      <div class="section-titles">
        <input
          type="text"
          value={FoundryAdapter.tryGetFlag($store.actor, 'notes1.name') ?? ''}
          placeholder={localize('T5EK.JournalPoi')}
          on:change|stopPropagation|preventDefault={(event) =>
            submitText(
              event,
              $store.actor,
              `flags.${CONSTANTS.MODULE_ID}.notes1.name`
            )}
        />
      </div>
      <SheetEditor
        content={FoundryAdapter.tryGetFlag($store.actor, 'notes1.value') ?? ''}
        target="flags.{CONSTANTS.MODULE_ID}.notes1.value"
        editable={$store.owner || FoundryAdapter.userIsGm()}
      />
    </article>
    <article>
      <div class="section-titles">
        <input
          type="text"
          value={FoundryAdapter.tryGetFlag($store.actor, 'notes2.name') ?? ''}
          placeholder={localize('T5EK.JournalLoi')}
          on:change|stopPropagation|preventDefault={(event) =>
            submitText(
              event,
              $store.actor,
              `flags.${CONSTANTS.MODULE_ID}.notes2.name`
            )}
        />
      </div>
      <SheetEditor
        content={FoundryAdapter.tryGetFlag($store.actor, 'notes2.value') ?? ''}
        target="flags.{CONSTANTS.MODULE_ID}.notes2.value"
        editable={$store.owner || FoundryAdapter.userIsGm()}
      />
    </article>
    <article>
      <div class="section-titles">
        <input
          type="text"
          value={FoundryAdapter.tryGetFlag($store.actor, 'notes3.name') ?? ''}
          placeholder={localize('T5EK.JournalQuests')}
          on:change|stopPropagation|preventDefault={(event) =>
            submitText(
              event,
              $store.actor,
              `flags.${CONSTANTS.MODULE_ID}.notes3.name`
            )}
        />
      </div>
      <SheetEditor
        content={FoundryAdapter.tryGetFlag($store.actor, 'notes3.value') ?? ''}
        target="flags.{CONSTANTS.MODULE_ID}.notes3.value"
        editable={$store.owner || FoundryAdapter.userIsGm()}
      />
    </article>
    <article>
      <div class="section-titles">
        <input
          type="text"
          value={FoundryAdapter.tryGetFlag($store.actor, 'notes4.name') ?? ''}
          placeholder={localize('T5EK.JournalMisc')}
          on:change|stopPropagation|preventDefault={(event) =>
            submitText(
              event,
              $store.actor,
              `flags.${CONSTANTS.MODULE_ID}.notes4.name`
            )}
        />
      </div>
      <SheetEditor
        content={FoundryAdapter.tryGetFlag($store.actor, 'notes4.value') ?? ''}
        target="flags.{CONSTANTS.MODULE_ID}.notes4.value"
        editable={$store.owner || FoundryAdapter.userIsGm()}
      />
    </article>
  </div>
  <div
    use:activateProseMirrorListeners
    class="right-notes note-entries"
    class:limited={$store.actor.limited}
  >
    <article class="journal-notes">
      <div class="section-titles">{localize('T5EK.JournalEntries')}</div>
      <SheetEditor
        content={FoundryAdapter.tryGetFlag($store.actor, 'notes.value') ?? ''}
        target="flags.{CONSTANTS.MODULE_ID}.notes.value"
        editable={$store.owner || FoundryAdapter.userIsGm()}
      />
    </article>
  </div>
</RerenderAfterFormSubmission>

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
