<script lang="ts">
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';
  import { getVehicleSheetContext } from 'src/sheets/sheet-context.svelte';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';

  let context = $derived(getVehicleSheetContext());
  let editing = $state(false);

  async function stopEditing() {
    editing = false;
  }
</script>

<div class="note-entries" data-tidy-track-scroll-y>
  {#if editing}
    <article class="editor-container flex-column full-height singleton">
      <SheetEditorV2
        enriched={context.biographyHTML}
        content={context.system.details.biography.value}
        field="system.details.biography.value"
        editorOptions={{
          editable: context.editable,
          toggled: false,
        }}
        documentUuid={context.actor.uuid}
        onSave={() => stopEditing()}
        manageSecrets={context.actor.isOwner}
      />
    </article>
  {:else if context.editable}
    <div class="biography-notes">
      <a class="edit-button icon-button" onclick={(ev) => (editing = true)}>
        <i class="fa-solid fa-feather"></i>
      </a>
      {#key context.biographyHTML}
        <div class="editor" use:manageSecrets={{ document: context.actor }}>
          <div
            data-field="system.details.biography.value"
            class="user-select-text"
          >
            {@html context.biographyHTML}
          </div>
        </div>
      {/key}
    </div>
  {/if}
</div>

<style lang="scss">
  .note-entries {
    flex: 1;
    overflow-y: scroll;
    padding-right: 0.75rem;
    height: 100%;
    display: flex;
    flex-direction: column;

    :global(.editor) {
      height: unset;
    }
  }

  .biography-notes {
    position: relative;
  }

  .edit-button {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
