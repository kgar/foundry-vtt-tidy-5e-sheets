<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ContentEditableFormField from '../../../../components/inputs/ContentEditableFormField.svelte';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';

  let context = $derived(getCharacterSheetContext());

  const localize = FoundryAdapter.localize;

  type SystemBioField = { field: string; value: string; text: string };

  let bioFields: SystemBioField[] = $derived([
    {
      field: 'system.details.gender',
      value: context.system.details.gender,
      text: 'DND5E.Gender',
    },
    {
      field: 'system.details.age',
      value: context.system.details.age,
      text: 'DND5E.Age',
    },
    {
      field: 'system.details.height',
      value: context.system.details.height,
      text: 'DND5E.Height',
    },
    {
      field: 'system.details.weight',
      value: context.system.details.weight,
      text: 'DND5E.Weight',
    },
    {
      field: 'system.details.eyes',
      value: context.system.details.eyes,
      text: 'DND5E.Eyes',
    },
    {
      field: 'system.details.skin',
      value: context.system.details.skin,
      text: 'DND5E.Skin',
    },
    {
      field: 'system.details.hair',
      value: context.system.details.hair,
      text: 'DND5E.Hair',
    },
    {
      field: 'system.details.faith',
      value: context.system.details.faith,
      text: 'DND5E.Faith',
    },
  ]);

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

<div class="scroll-container">
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
  <div class="notes-container" class:hidden={editing}>
    <div
      class="top-notes note-entries"
      class:limited={context.showLimitedSheet}
    >
      <article>
        <ul class="character-details">
          {#each bioFields as bioField (bioField.field)}
            <li>
              <span>{localize(bioField.text)}:</span>
              <ContentEditableFormField
                selectOnFocus={true}
                element="span"
                editable={context.editable && !context.lockSensitiveFields}
                document={context.actor}
                field={bioField.field}
                value={bioField.value ?? ''}
                cssClass="detail-input"
              />
            </li>
          {/each}
        </ul>
      </article>
    </div>
    <div
      class="left-notes note-entries hide-editor-edit"
      class:limited={context.showLimitedSheet}
    >
      {@render biopage(
        'DND5E.PersonalityTraits',
        context.system.details.trait,
        context.traitEnrichedHtml,
        'system.details.trait',
      )}

      {@render biopage(
        'DND5E.Ideals',
        context.system.details.ideal,
        context.idealEnrichedHtml,
        'system.details.ideal',
      )}

      {@render biopage(
        'DND5E.Bonds',
        context.system.details.bond,
        context.bondEnrichedHtml,
        'system.details.bond',
      )}

      {@render biopage(
        'DND5E.Flaws',
        context.system.details.flaw,
        context.flawEnrichedHtml,
        'system.details.flaw',
      )}
    </div>

    <div
      class="right-notes note-entries hide-editor-edit"
      class:limited={context.showLimitedSheet}
    >
      <article class="appearance-notes">
        <div
          class="section-titles biopage flex-row justify-content-space-between"
        >
          <span>
            {localize('DND5E.Appearance')}
          </span>
          <a
            class="icon-button"
            onclick={(ev) =>
              context.editable &&
              edit(
                context.system.details.appearance,
                context.appearanceEnrichedHtml,
                'system.details.appearance',
              )}
          >
            <i class="fa-solid fa-feather"></i>
          </a>
        </div>
        {#key context.appearanceEnrichedHtml}
          <div
            class="editor"
            use:manageSecrets={{ document: context.document }}
          >
            <div
              data-field="system.details.appearance"
              class="user-select-text"
            >
              {@html context.appearanceEnrichedHtml}
            </div>
          </div>
        {/key}
      </article>
      <article class="biography-notes">
        <div class="section-titles flex-row justify-content-space-between">
          <span>
            {localize('DND5E.Background')}/{localize('DND5E.Biography')}
          </span>
          <a
            class="icon-button"
            onclick={(ev) =>
              context.editable &&
              edit(
                context.system.details.biography.value,
                context.biographyEnrichedHtml,
                'system.details.biography.value',
              )}
          >
            <i class="fa-solid fa-feather"></i>
          </a>
        </div>
        {#key context.biographyEnrichedHtml}
          <div
            class="editor"
            use:manageSecrets={{ document: context.document }}
          >
            <div
              data-field="system.details.biography.value"
              class="user-select-text"
            >
              {@html context.biographyEnrichedHtml}
            </div>
          </div>
        {/key}
      </article>
    </div>
  </div>
</div>

{#snippet biopage(
  label: string,
  value: string,
  enrichedHTML: string,
  target: string,
)}
  <article>
    <div class="section-titles biopage flex-row justify-content-space-between">
      <span>{localize(label)}</span>
      <a
        class="icon-button"
        onclick={(ev) => context.editable && edit(value, enrichedHTML, target)}
      >
        <i class="fa-solid fa-feather"></i>
      </a>
    </div>
    {#key enrichedHTML}
      <div class="editor" use:manageSecrets={{ document: context.document }}>
        <div data-field={target} class="user-select-text">
          {@html enrichedHTML}
        </div>
      </div>
    {/key}
  </article>
{/snippet}

<style lang="scss">
  .notes-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
    gap: 0.5rem;
  }

  .notes-container {
    display: grid;
    grid-template-areas:
      'top    top'
      'left   right';
    grid-template-columns: 21.5rem 1fr;
    grid-template-rows: auto 1fr;
    min-height: 31.25rem;
  }

  .top-notes {
    grid-area: top;
  }

  .left-notes {
    grid-area: left;
  }

  .right-notes {
    grid-area: right;
  }

  .left-notes,
  .right-notes {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    gap: 0.5rem;
    > * {
      flex: 1;
      overflow: auto;
    }
  }

  .top-notes {
    width: 100%;

    .character-details {
      margin: 0;
      padding: 0;
      display: flex;
      gap: 0.25rem;
      flex-wrap: wrap;
    }

    li {
      display: flex;
      flex: 0 0 calc(100% / 3 - 0.25rem);

      :global(span) {
        flex: 1;
        margin: 0 0.5rem 0 0.25rem;
      }

      :global(span:first-child) {
        flex: 0 0 0.0625rem;
        font-weight: 600;
        margin: 0;
      }
    }
  }

  .character-details :global(.detail-input) {
    flex: 1;
    margin: 0 0.5rem 0 0.25rem;
  }

  .singleton :global(.editor.prosemirror) {
    flex: 1;
  }
</style>
