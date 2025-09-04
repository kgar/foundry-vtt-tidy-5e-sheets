<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { TidyFlags } from 'src/api';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  type FlagBioField = {
    field: string;
    value: string | undefined | null;
    text: string;
  };

  let bioFields: FlagBioField[] = $derived([
    {
      field: 'system.details.alignment',
      value: context.system.details.alignment,
      text: 'DND5E.Alignment',
    },
    {
      field: TidyFlags.gender.prop,
      value: TidyFlags.gender.get(context.actor),
      text: 'DND5E.Gender',
    },
    {
      field: TidyFlags.age.prop,
      value: TidyFlags.age.get(context.actor),
      text: 'DND5E.Age',
    },
    {
      field: TidyFlags.height.prop,
      value: TidyFlags.height.get(context.actor),
      text: 'DND5E.Height',
    },
    {
      field: TidyFlags.weight.prop,
      value: TidyFlags.weight.get(context.actor),
      text: 'DND5E.Weight',
    },
    {
      field: TidyFlags.eyes.prop,
      value: TidyFlags.eyes.get(context.actor),
      text: 'DND5E.Eyes',
    },
    {
      field: TidyFlags.skin.prop,
      value: TidyFlags.skin.get(context.actor),
      text: 'DND5E.Skin',
    },
    {
      field: TidyFlags.hair.prop,
      value: TidyFlags.hair.get(context.actor),
      text: 'DND5E.Hair',
    },
    {
      field: TidyFlags.faith.prop,
      value: TidyFlags.faith.get(context.actor),
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

<div class="biography-grid" class:hidden={editing}>
  <article style="grid-area: top;">
    <ul class="biography-entries">
      {#each bioFields as bioField (bioField.field)}
        <li class="form-group">
          <label class="biography-entry-label" for={bioField.field}
            >{localize(bioField.text)}</label
          >
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
        </li>
      {/each}
    </ul>
  </article>

  <div class="biography-left">
    {@render bioEditorEntry(
      'fa-puzzle-piece',
      'DND5E.PersonalityTraits',
      TidyFlags.trait.get(context.actor) ?? '',
      context.enriched.trait,
      TidyFlags.trait.prop,
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
      TidyFlags.appearance.get(context.actor) ?? '',
      context.enriched.appearance,
      TidyFlags.appearance.prop,
    )}

    {@render bioEditorEntry(
      'fa-book-user',
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
        {#if context.editable}
          <a
            class="button button-borderless button-icon-only flexshrink"
            onclick={() => edit(value, enriched, field)}
          >
            <i class="fa-solid fa-feather"></i>
          </a>
        {/if}
      </h3>
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </div>
    {#key enriched}
      <div class="editor" use:manageSecrets={{ document: context.actor }}>
        <div data-field={field} class="user-select-text">
          {@html enriched}
        </div>
      </div>
    {/key}
  </article>
{/snippet}
