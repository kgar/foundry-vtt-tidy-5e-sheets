<script lang="ts">
  import SheetEditor from '../SheetEditor.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { VehicleSheetContext } from 'src/types/types';
  import RerenderAfterFormSubmission from 'src/components/shared/RerenderAfterFormSubmission.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  let store = getContext<Readable<VehicleSheetContext>>('store');

  function activateProseMirrorListeners(node: HTMLElement) {
    $store.activateFoundryJQueryListeners(node);
  }
</script>

<div class="note-entries">
  <RerenderAfterFormSubmission
    andOnValueChange={$store.system.details.biography.value}
  >
    <article class="biography-notes" use:activateProseMirrorListeners>
      <SheetEditor
        content={$store.biographyHTML}
        target="system.details.biography.value"
        editable={$store.owner || FoundryAdapter.userIsGm()}
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
