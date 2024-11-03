<script lang="ts">
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { isNil } from 'src/utils/data';
  import { createEventDispatcher } from 'svelte';
  import GoldHeaderUnderline from './GoldHeaderUnderline.svelte';

  export let title: string;
  export let expanded: boolean;
  export let enriched: string;
  export let document: any;
  export let field: string;

  $: showIndicator = !isNil(enriched, '');

  const dispatcher = createEventDispatcher<{
    edit: { document: any; field: string };
  }>();
</script>

<section class="collapsible-editor">
  <!-- Header -->
  <header>
    <a class="title" on:click={() => (expanded = !expanded)}>
      <!-- Title -->
      {title}
      {#if showIndicator}
        <!-- Expand Indicator, if there's nonblank content -->
        <i class="fas fa-angle-right fa-fw expand-indicator" class:expanded></i>
      {/if}
    </a>
    <!-- Journal Edit Button -->
    <a
      class="edit icon-button"
      on:click={() => dispatcher('edit', { document, field })}
    >
      <i class="fas fa-feather fa-fw"></i>
    </a>
    <GoldHeaderUnderline />
  </header>

  <!-- Body -->
  <ExpandableContainer class="editor-content" {expanded}>
    {@html enriched}
  </ExpandableContainer>
</section>
