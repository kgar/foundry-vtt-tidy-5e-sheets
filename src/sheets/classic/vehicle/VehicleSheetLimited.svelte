<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import LimitedHeader from '../actor/LimitedHeader.svelte';
  import { getVehicleSheetContext } from 'src/sheets/sheet-context.svelte';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';

  let context = $derived(getVehicleSheetContext());

  const localize = FoundryAdapter.localize;
</script>

<div class="limited-vehicle">
  <LimitedHeader rounded={context.useRoundedPortraitStyle} />
  <section class="tidy-sheet-body">
    <div class="note-entries flex-1">
      <article class="biography-notes">
        <div class="section-titles">
          {localize('DND5E.Description')}
        </div>
        {#key context.biographyHTML}
          {#if context.unlocked}
            <SheetEditorV2
              documentUuid={context.document.uuid}
              content={context.system.biography.value}
              editorOptions={{ toggled: false }}
              manageSecrets={true}
              field="system.details.biography.value"
              enriched={context.biographyHTML}
            ></SheetEditorV2>
          {:else}
            <div
              class="editor"
              use:manageSecrets={{ document: context.document }}
            >
              <div
                data-field="system.details.biography.value"
                class="user-select-text"
              >
                {@html context.biographyHTML}
              </div>
            </div>
          {/if}
        {/key}
      </article>
    </div>
  </section>
</div>

<style lang="less">
  .limited-vehicle {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .tidy-sheet-body {
    flex: 1;
    margin-right: 1rem;
    display: flex;

    .note-entries {
      height: 100%;
      display: flex;
      flex-direction: row;
    }
  }
</style>
