<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

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
    await context.actor.sheet.submit();
    editing = false;
  }

  function edit(value: string, enriched: string, field: string) {
    contentToEdit = value;
    fieldToEdit = field;
    enrichedText = enriched;
    editing = true;
  }
</script>

{#if editing}
  {#key contentToEdit}
    <article class="editor-container singleton">
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

<div class="biography-grid" class:hidden={editing}>
  <article style="grid-area: top;">
    <ul class="biography-entries">
      {#each bioFields as bioField (bioField.field)}
        <li class="form-group">
          <label class="biography-entry-label" for={bioField.field}>{localize(bioField.text)}</label>
          <!-- {#if context.unlocked} -->
          <div class="form-fields">
            <TextInputQuadrone
              id={bioField.field}
              document={context.actor}
              field={bioField.field}
              value={bioField.value}
              selectOnFocus={true}
              class="biography-entry-value"
              disabled={!context.unlocked}
            />
          </div>
          <!-- {:else}
            <span class="biography-entry-value">
              {bioField.value}
            </span>
          {/if} -->
        </li>
      {/each}
    </ul>
  </article>

  <div class="biography-left">
    {@render bioEditorEntry(
      'fa-puzzle-piece',
      'DND5E.PersonalityTraits',
      context.system.details.trait,
      context.enriched.trait,
      'system.details.trait',
    )}

    {@render bioEditorEntry(
      'fa-seedling',
      'DND5E.Ideals',
      context.system.details.ideal,
      context.enriched.ideal,
      'system.details.ideal',
    )}

    {@render bioEditorEntry(
      'fa-link',
      'DND5E.Bonds',
      context.system.details.bond,
      context.enriched.bond,
      'system.details.bond',
    )}

    {@render bioEditorEntry(
      'fa-heart-crack',
      'DND5E.Flaws',
      context.system.details.flaw,
      context.enriched.flaw,
      'system.details.flaw',
    )}
  </div>

  <div class="biography-right">
    {@render bioEditorEntry(
      'fa-image-portrait',
      'DND5E.Appearance',
      context.system.details.appearance,
      context.enriched.appearance,
      'system.details.appearance',
    )}

    {@render bioEditorEntry(
      'fa-journal',
      'DND5E.Biography',
      context.system.details.biography.value,
      context.enriched.biography,
      'system.details.biography.value',
    )}
  </div>
</div>

{#snippet bioEditorEntry(
  icon: string,
  label: string,
  value: string,
  enriched: string,
  field: string,
)}
  <article class="biography-editor-container">
    <div class="biography-editor-title">
      <h3 class="font-title-small flexrow">
        <i class="fa-solid {icon} flexshrink"></i>
        <span class="flex1">{localize(label)}</span>
        <a
          class="button button-borderless button-icon-only flexshrink"
          onclick={(ev) => context.editable && edit(value, enriched, field)}
        >
          <i class="fa-solid fa-feather"></i>
        </a>
      </h3> 
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </div>
    {#key enriched}
      <div class="editor" use:manageSecrets={{ document }}>
        <div data-field={field} class="user-select-text">
          {@html enriched}
        </div>
      </div>
    {/key}
  </article>
{/snippet}
