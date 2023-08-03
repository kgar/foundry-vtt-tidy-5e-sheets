<script lang="ts">
  import RerenderAfterFormSubmission from 'src/components/shared/RerenderAfterFormSubmission.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SheetEditor from 'src/sheets/SheetEditor.svelte';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<ItemSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  function activateProseMirrorListeners(node: HTMLElement) {
    $store.activateFoundryJQueryListeners(node);
  }
</script>

<RerenderAfterFormSubmission>
  <article class="editor-container" use:activateProseMirrorListeners>
    <h2 class="details-headline">{localize('TIDY5E.ItemDetailsHeadline')}</h2>
    <SheetEditor
      content={$store.descriptionHTML}
      editable={$store.editable}
      target="system.description.value"
    />
  </article>
</RerenderAfterFormSubmission>
