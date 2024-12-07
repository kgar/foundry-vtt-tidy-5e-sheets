<script lang="ts">
  import SheetEditor from '../../../../components/editor/SheetEditor.svelte';
  import RerenderAfterFormSubmission from 'src/components/utility/RerenderAfterFormSubmission.svelte';
  import { getVehicleSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = getVehicleSheetContext();
</script>

<div class="note-entries" data-tidy-track-scroll-y>
  <RerenderAfterFormSubmission
    andOnValueChange={context.system.details.biography.value}
  >
    <article class="biography-notes" use:context.activateEditors>
      <SheetEditor
        content={context.biographyHTML}
        target="system.details.biography.value"
        editable={context.editable}
      />
    </article>
  </RerenderAfterFormSubmission>
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
</style>
