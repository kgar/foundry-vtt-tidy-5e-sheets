<script lang="ts">
  import RerenderAfterFormSubmission from 'src/components/utility/RerenderAfterFormSubmission.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SheetEditor from '../../../components/editor/SheetEditor.svelte';
  import LimitedHeader from '../actor/LimitedHeader.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { getNpcSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getNpcSheetContext());

  const localize = FoundryAdapter.localize;
</script>

<div class="limited-npc">
  <LimitedHeader rounded={context.useRoundedPortraitStyle} />
  <section class="tidy-sheet-body">
    <div class="note-entries">
      <RerenderAfterFormSubmission
        andOnValueChange={context.system.details.biography.value}
      >
        <article class="appearance-notes" use:context.activateEditors>
          <div class="section-titles biopage">
            {localize('DND5E.Appearance')}
          </div>
          <SheetEditor
            content={TidyFlags.appearance.get(context.actor) ?? ''}
            target={TidyFlags.appearance.prop}
            editable={context.editable}
          />
        </article>
        <article class="biography-notes" use:context.activateEditors>
          <div class="section-titles">
            {localize('DND5E.Background')}/{localize('DND5E.Biography')}
          </div>
          <SheetEditor
            content={context.biographyHTML}
            target="system.details.biography.value"
            editable={context.editable}
          />
        </article>
      </RerenderAfterFormSubmission>
    </div>
  </section>
</div>

<style lang="scss">
  .limited-npc {
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
