<script lang="ts">
  import SheetEditor from '../../../components/editor/SheetEditor.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { VehicleSheetContext } from 'src/types/types';
  import RerenderAfterFormSubmission from 'src/components/utility/RerenderAfterFormSubmission.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  let context = getContext<Readable<VehicleSheetContext>>('context');

  function activateProseMirrorListeners(node: HTMLElement) {
    $context.activateFoundryJQueryListeners(node);
  }
</script>

<div class="note-entries" data-tidy-track-scroll-y>
  <RerenderAfterFormSubmission
    andOnValueChange={$context.system.details.biography.value}
  >
    <article class="biography-notes" use:activateProseMirrorListeners>
      <SheetEditor
        content={$context.biographyHTML}
        target="system.details.biography.value"
        editable={$context.owner || FoundryAdapter.userIsGm()}
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
