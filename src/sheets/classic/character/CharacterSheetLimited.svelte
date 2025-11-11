<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import LimitedHeader from '../actor/LimitedHeader.svelte';
  import { getNpcSheetContext } from 'src/sheets/sheet-context.svelte';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';

  let context = $derived(getNpcSheetContext());

  const localize = FoundryAdapter.localize;
</script>

<div class="limited-character">
  <LimitedHeader rounded={context.useRoundedPortraitStyle} />
  <section class="tidy-sheet-body">
    <div class="note-entries">
      <article class="appearance-notes">
        <div class="section-titles biopage">
          {localize('DND5E.Appearance')}
        </div>
        {#key context.appearanceEnrichedHtml}
          {#if context.unlocked}
            <SheetEditorV2
              documentUuid={context.document.uuid}
              content={context.system.details.appearance}
              editorOptions={{ toggled: false }}
              manageSecrets={true}
              field="system.details.appearance"
              enriched={context.appearanceEnrichedHtml}
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
                {@html context.appearanceEnrichedHtml}
              </div>
            </div>
          {/if}
        {/key}
      </article>
      <article class="biography-notes">
        <div class="section-titles">
          {localize('DND5E.Background')}/{localize('DND5E.Biography')}
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
  .limited-character {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .tidy-sheet-body {
    flex: 1;
    margin-right: 1rem;

    .note-entries {
      height: 100%;
      display: flex;
      flex-direction: row;
      gap: 0.5rem;

      > * {
        flex: 1;
        min-width: 0;
      }
    }
  }
</style>
