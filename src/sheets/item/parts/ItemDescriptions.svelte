<script lang="ts">
  import RerenderAfterFormSubmission from 'src/components/utility/RerenderAfterFormSubmission.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Accordion from 'src/components/accordion/Accordion.svelte';
  import AccordionItem from 'src/components/accordion/AccordionItem.svelte';
  import OpenSheetEditor from 'src/components/editor/OpenSheetEditor.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  function onEditorActivation(node: HTMLElement) {
    if (latch) {
      editing = false;
      latch = false;
      return;
    }

    $context.activateFoundryJQueryListeners(node);
    latch = true;
  }

  let editing = false;
  let latch = false;
  let valueToEdit: string;
  let fieldToEdit: string;

  function edit(value: string, field: string) {
    valueToEdit = value;
    fieldToEdit = field;
    editing = true;
  }
</script>

<Accordion multiple class={editing ? 'hidden' : ''}>
  <AccordionItem>
    <span slot="header" class="flex-1 flex-row justify-content-space-between">
      {localize('DND5E.Description')}

      {#if $context.owner}
        <button
          type="button"
          class="inline-icon-button"
          on:click|stopPropagation={() =>
            edit($context.enriched.description, 'system.description.value')}
          ><i class="fas fa-edit" /></button
        >
      {/if}
    </span>
    {@html $context.enriched.description}
  </AccordionItem>
  <AccordionItem>
    <span slot="header" class="flex-1 flex-row justify-content-space-between">
      {localize('DND5E.DescriptionUnidentified')}

      {#if $context.owner}
        <button
          type="button"
          class="inline-icon-button"
          on:click|stopPropagation={() =>
            edit(
              $context.enriched.unidentified,
              'system.description.unidentified'
            )}><i class="fas fa-edit" /></button
        >
      {/if}
    </span>
    {@html $context.enriched.unidentified}
  </AccordionItem>
  <AccordionItem>
    <span slot="header" class="flex-1 flex-row justify-content-space-between">
      {localize('DND5E.DescriptionChat')}

      {#if $context.owner}
        <button
          type="button"
          class="inline-icon-button"
          on:click|stopPropagation={() =>
            edit($context.enriched.chat, 'system.description.chat')}
          ><i class="fas fa-edit" /></button
        >
      {/if}
    </span>
    {@html $context.enriched.chat}
  </AccordionItem>
</Accordion>

{#if editing}
  <RerenderAfterFormSubmission andOnValueChange={valueToEdit}>
    <article class="editor-container" use:onEditorActivation>
      <OpenSheetEditor content={valueToEdit} target={fieldToEdit} />
    </article>
  </RerenderAfterFormSubmission>
{/if}
