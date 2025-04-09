<script lang="ts">
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { isNil } from 'src/utils/data';
  import GoldHeaderUnderline from './GoldHeaderUnderline.svelte';
  import type { ItemDescription } from 'src/types/item.types';
  import { manageSecrets } from 'src/actions/manage-secrets.svelte';

  interface Props {
    expanded: boolean;
    document: any;
    itemDescription: ItemDescription;
    onEdit?: (detail: {
      document: any;
      itemDescription: ItemDescription;
    }) => void;
    disabled?: boolean;
  }

  let {
    expanded = $bindable(),
    document,
    itemDescription,
    onEdit,
    disabled,
  }: Props = $props();

  let showIndicator = $derived(!isNil(itemDescription.enriched, ''));
</script>

<section class="collapsible-editor">
  <!-- Header -->
  <header>
    <a class="title" onclick={() => (expanded = !expanded)}>
      <!-- Title -->
      {itemDescription.label}
      {#if showIndicator}
        <!-- Expand Indicator, if there's nonblank content -->
        <i class="fas fa-angle-right fa-fw expand-indicator" class:expanded></i>
      {/if}
    </a>
    {#if !disabled}
      <!-- Journal Edit Button -->
      <a
        class={['edit', 'button-icon-only']}
        onclick={() => onEdit?.({ document, itemDescription })}
      >
        <i class="fas fa-feather fa-fw"></i>
      </a>
    {/if}
    <GoldHeaderUnderline />
  </header>

  <!-- Body -->
  <ExpandableContainer {expanded}>
    {#key itemDescription.enriched}
      <div class="editor" use:manageSecrets={{ document }}>
        <div data-field={itemDescription.field} class="user-select-text">
          {@html itemDescription.enriched}
        </div>
      </div>
    {/key}
  </ExpandableContainer>
</section>
