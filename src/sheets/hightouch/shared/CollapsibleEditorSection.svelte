<script lang="ts">
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { isNil } from 'src/utils/data';
  import { createEventDispatcher } from 'svelte';
  import GoldHeaderUnderline from './GoldHeaderUnderline.svelte';
  import type { ItemDescription } from 'src/types/item.types';

  export let expanded: boolean;
  export let document: any;
  export let itemDescription: ItemDescription;

  $: showIndicator = !isNil(itemDescription.enriched, '');

  const dispatcher = createEventDispatcher<{
    edit: { document: any; itemDescription: ItemDescription };
  }>();

  function manageSecrets(node: HTMLElement) {
    if (!document.isOwner) {
      return;
    }

    const secret = new HTMLSecret({
      parentSelector: `[data-edit]`,
      callbacks: {
        content: (secret: HTMLElement) =>
          foundry.utils.getProperty(
            document,
            secret.closest<HTMLElement>('[data-edit]')!.dataset.edit,
          ),
        update: (secret: HTMLElement, content: string) =>
          document.update({
            [secret.closest<HTMLElement>('[data-edit]')!.dataset.edit!]:
              content,
          }),
      },
    });

    queueMicrotask(() => {
      secret.bind(node);
    });
  }
</script>

<section class="collapsible-editor">
  <!-- Header -->
  <header>
    <a class="title" on:click={() => (expanded = !expanded)}>
      <!-- Title -->
      {itemDescription.label}
      {#if showIndicator}
        <!-- Expand Indicator, if there's nonblank content -->
        <i class="fas fa-angle-right fa-fw expand-indicator" class:expanded></i>
      {/if}
    </a>
    <!-- Journal Edit Button -->
    <a
      class="edit icon-button"
      on:click={() => dispatcher('edit', { document, itemDescription })}
    >
      <i class="fas fa-feather fa-fw"></i>
    </a>
    <GoldHeaderUnderline />
  </header>

  <!-- Body -->
  <ExpandableContainer {expanded}>
    {#key itemDescription.enriched}
      <div class="editor" use:manageSecrets>
        <div data-edit={itemDescription.field} class="user-select-text">
          {@html itemDescription.enriched}
        </div>
      </div>
    {/key}
  </ExpandableContainer>
</section>
