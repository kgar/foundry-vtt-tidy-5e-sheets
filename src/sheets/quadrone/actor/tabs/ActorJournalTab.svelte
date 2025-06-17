<script lang="ts">
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';
  import { TidyFlags, type ActorJournalEntry } from 'src/api';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSheetQuadroneContext } from 'src/types/types';
  import { isNil } from 'src/utils/data';

  let context = $derived(getSheetContext<ActorSheetQuadroneContext>());

  let enrichmentArgs = $derived({
    secrets: context.owner,
    rollData: context.rollData,
    relativeTo: context.actor,
  });

  let selected = $state<{ index: number; entry: ActorJournalEntry }>();
  let editing = $state<boolean>(false);
  let enrichedPromise = $derived(
    !isNil(selected?.entry.value)
      ? foundry.applications.ux.TextEditor.enrichHTML(selected.entry.value)
      : Promise.resolve(''),
  );
</script>

{#if editing}{/if}

<div>
  <div class={['journal-entry-selector', { hidden: editing }]}></div>
  <div class={['journal-entry-viewer', { hidden: editing }]}>
    {#await enrichedPromise then enriched}
      <div class="editor" use:manageSecrets={{ document: context.document }}>
        <div
          data-field={selected
            ? `${TidyFlags.actorJournal.prop}.${selected?.index}.value`
            : ''}
          class="user-select-text"
        >
          {@html enriched}
        </div>
      </div>
    {/await}
  </div>
</div>
