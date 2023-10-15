<script lang="ts">
  import RerenderAfterFormSubmission from 'src/components/shared/RerenderAfterFormSubmission.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SheetEditor from 'src/sheets/SheetEditor.svelte';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  function activateProseMirrorListeners(node: HTMLElement) {
    $context.activateFoundryJQueryListeners(node);
  }
</script>

<RerenderAfterFormSubmission andOnValueChange={$context.descriptionHTML}>
  <article class="editor-container" use:activateProseMirrorListeners>
    <h2 class="details-headline">{localize('T5EK.ItemDetailsHeadline')}</h2>
    <SheetEditor
      content={$context.descriptionHTML}
      editable={$context.owner || FoundryAdapter.userIsGm()}
      target="system.description.value"
    />
  </article>
</RerenderAfterFormSubmission>
