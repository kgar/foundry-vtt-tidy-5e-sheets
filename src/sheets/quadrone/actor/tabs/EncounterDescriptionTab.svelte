<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';

  let context = $derived(getEncounterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

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
</script>

<div class="tab-right-column">
  <div class="tab-content">
    {#if editing}
      {#key contentToEdit}
        <article class="flexible-editor-container singleton">
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

    <article class="summary-editor-container" class:hidden={editing}>
      <div class="summary-editor-title">
        <h3 class="font-title-small flexrow">
          <i class="fa-solid fa-note-sticky flexshrink"></i>
          <span class="flex1">{localize('DND5E.Summary')}</span>
          {#if context.editable}
            <a
              class={['button button-borderless button-icon-only flexshrink']}
              onclick={() =>
                edit(
                  context.actor.system.description.summary,
                  context.enriched.description.summary,
                  'system.description.summary',
                )}
            >
              <i class="fa-solid fa-feather"></i>
            </a>
          {/if}
        </h3>
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </div>
      {#key context.enriched.description.summary}
        <div class="editor" use:manageSecrets={{ document: context.actor }}>
          <div data-field="system.description.summary" class="user-select-text">
            {@html context.enriched.description.summary}
          </div>
        </div>
      {/key}
    </article>
    <article class="description-editor-container" class:hidden={editing}>
      <div class="description-editor-title">
        <h3 class="font-title-small flexrow">
          <i class="fa-solid fa-notebook flexshrink"></i>
          <span class="flex1">{localize('DND5E.Description')}</span>
          {#if context.editable}
            <a
              class={['button button-borderless button-icon-only flexshrink']}
              onclick={() =>
                edit(
                  context.actor.system.description.full,
                  context.enriched.description.full,
                  'system.description.full',
                )}
            >
              <i class="fa-solid fa-feather"></i>
            </a>
          {/if}
        </h3>
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </div>
      {#key context.enriched.description.full}
        <div class="editor" use:manageSecrets={{ document: context.actor }}>
          <div data-field="system.description.full" class="user-select-text">
            {@html context.enriched.description.full}
          </div>
        </div>
      {/key}
    </article>
  </div>
</div>
