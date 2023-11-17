<script lang="ts">
  import RerenderAfterFormSubmission from 'src/components/utility/RerenderAfterFormSubmission.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Accordion from 'src/components/accordion/Accordion.svelte';
  import AccordionItem from 'src/components/accordion/AccordionItem.svelte';
  import SheetEditor from 'src/components/editor/SheetEditor.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  function activateProseMirrorListeners(node: HTMLElement) {
    $context.activateFoundryJQueryListeners(node);
    editingDescription = false;
  }

  let editingDescription = false;
</script>

<Accordion multiple>
  <AccordionItem>
    <span slot="header">
      {localize('DND5E.Description')}
    </span>
    <RerenderAfterFormSubmission
      andOnValueChange={$context.item.system.description.value}
    >
      <article class="editor-container" use:activateProseMirrorListeners>
        <SheetEditor
          content={$context.enriched.description}
          editable={$context.owner || FoundryAdapter.userIsGm()}
          target="system.description.value"
        />
      </article>
    </RerenderAfterFormSubmission>
  </AccordionItem>
  <AccordionItem>
    <span slot="header">
      {localize('DND5E.DescriptionUnidentified')}
    </span>
    <RerenderAfterFormSubmission
      andOnValueChange={$context.item.system.description.unidentified}
    >
      <article class="editor-container" use:activateProseMirrorListeners>
        <SheetEditor
          content={$context.enriched.unidentified}
          editable={$context.owner || FoundryAdapter.userIsGm()}
          target="system.description.unidentified"
        />
      </article>
    </RerenderAfterFormSubmission>
  </AccordionItem>
  <AccordionItem>
    <span slot="header">
      {localize('DND5E.DescriptionChat')}
    </span>
    <RerenderAfterFormSubmission
      andOnValueChange={$context.item.system.description.chat}
    >
      <article class="editor-container" use:activateProseMirrorListeners>
        <SheetEditor
          content={$context.enriched.chat}
          editable={$context.owner || FoundryAdapter.userIsGm()}
          target="system.description.chat"
        />
      </article>
    </RerenderAfterFormSubmission>
  </AccordionItem>
</Accordion>
