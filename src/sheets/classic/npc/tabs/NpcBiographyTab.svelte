<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ContentEditableFormField from 'src/components/inputs/ContentEditableFormField.svelte';
  import { settings } from 'src/settings/settings.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import { getNpcSheetContext } from 'src/sheets/sheet-context.svelte';
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';

  let context = $derived(getNpcSheetContext());

  const localize = FoundryAdapter.localize;

  let showNpcPersonalityInfo = $derived(
    TidyFlags.showNpcPersonalityInfo.get(context.actor) ?? false,
  );

  function togglePersonalityInfo() {
    TidyFlags.setFlag(
      context.actor,
      'showNpcPersonalityInfo',
      !showNpcPersonalityInfo,
    );
  }

  type FlagBioField = {
    prop: string;
    value: string | undefined | null;
    text: string;
  };

  let bioFields: FlagBioField[] = $derived([
    {
      prop: TidyFlags.gender.prop,
      value: TidyFlags.gender.get(context.actor),
      text: 'DND5E.Gender',
    },
    {
      prop: TidyFlags.age.prop,
      value: TidyFlags.age.get(context.actor),
      text: 'DND5E.Age',
    },
    {
      prop: TidyFlags.height.prop,
      value: TidyFlags.height.get(context.actor),
      text: 'DND5E.Height',
    },
    {
      prop: TidyFlags.weight.prop,
      value: TidyFlags.weight.get(context.actor),
      text: 'DND5E.Weight',
    },
    {
      prop: TidyFlags.eyes.prop,
      value: TidyFlags.eyes.get(context.actor),
      text: 'DND5E.Eyes',
    },
    {
      prop: TidyFlags.skin.prop,
      value: TidyFlags.skin.get(context.actor),
      text: 'DND5E.Skin',
    },
    {
      prop: TidyFlags.hair.prop,
      value: TidyFlags.hair.get(context.actor),
      text: 'DND5E.Hair',
    },
    {
      prop: TidyFlags.faith.prop,
      value: TidyFlags.faith.get(context.actor),
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
          {#each bioFields as bioField (bioField.prop)}
            <li>
              <span>{localize(bioField.text)}:</span>
              <ContentEditableFormField
                selectOnFocus={true}
                element="span"
                editable={context.editable && !context.lockSensitiveFields}
                document={context.actor}
                field={bioField.prop}
                value={bioField.value ?? ''}
                cssClass="detail-input"
              />
            </li>
          {/each}
        </ul>
      </article>
    </div>
    <div class="bottom-notes">
      <button
        type="button"
        onclick={togglePersonalityInfo}
        class="toggle-personality-info"
        title={localize('TIDY5E.TogglePersonalityInfo')}
        tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
      >
        {#if showNpcPersonalityInfo}
          <i class="fas fa-angle-double-left"></i>
        {:else}
          <i class="fas fa-angle-double-right"></i>
        {/if}
      </button>
      <div class="main-notes">
        {#if showNpcPersonalityInfo}
          <div
            class="left-notes note-entries hide-editor-edit"
            class:limited={context.showLimitedSheet}
          >
            {@render biopage(
              'DND5E.PersonalityTraits',
              TidyFlags.trait.get(context.actor) ?? '',
              context.traitEnrichedHtml,
              TidyFlags.trait.prop,
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
        {/if}
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
                    TidyFlags.appearance.get(context.actor) ?? '',
                    context.appearanceEnrichedHtml,
                    TidyFlags.appearance.prop,
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
                  data-field={TidyFlags.appearance.prop}
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
  }

  .main-notes {
    display: flex;
    flex: 1;
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

  .top-notes {
    width: 100%;
    margin-bottom: 0.5rem;

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

  .toggle-personality-info {
    width: auto;
    border: none;
    align-self: flex-start;
    transition:
      color 0.3s ease,
      transform 0.3s ease;
    padding: 1.25rem 0.25rem;
    background: var(--t5e-faint-color);
    border-radius: 0.1875rem;
    margin-right: 0.25rem;
    color: var(--t5e-tertiary-color);
    cursor: pointer;

    &:hover {
      color: var(--t5e-secondary-color);
    }
  }

  .singleton :global(.editor.prosemirror) {
    flex: 1;
  }

  .bottom-notes {
    display: flex;
    gap: 0.25rem;
    height: 100%;
    min-height: 0;
  }
</style>
