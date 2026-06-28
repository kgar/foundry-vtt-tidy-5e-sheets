<script lang="ts">
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { isNil } from 'src/utils/data';
  import GoldHeaderUnderline from './GoldHeaderUnderline.svelte';
  import type { ItemDescription } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  const localize = FoundryAdapter.localize;

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

  let hasContent = $derived(!isNil(itemDescription.content, ''));
</script>

<section class={['collapsible-editor', hasContent ? undefined : 'no-content']}>
  <!-- Header -->
  <header>
    <!-- svelte-ignore a11y_missing_attribute -->
    <a class="title" 
      onclick={() => (expanded = !expanded)}
      role="button"
      tabindex="0"
      onkeydown={(ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          expanded = !expanded;
        }
      }}
    >
      <!-- Title -->
      {itemDescription.label}
      {#if hasContent}
        <!-- Expand Indicator, if there's nonblank content -->
        <i class={['fas fa-angle-right fa-fw expand-indicator', { expanded }]}
        ></i>
      {/if}
    </a>
    {#if !disabled}
      <!-- Journal Edit Button -->
      <!-- svelte-ignore a11y_missing_attribute -->
      <a
        class={['edit', 'button-icon-only']}
        aria-label={localize('EDITOR.DND5E.DescriptionEdit', { description: localize('DND5E.Description') })}
        onclick={() => onEdit?.({ document, itemDescription })}
        role="button"
        tabindex="0"
        onkeydown={(ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') {
            onEdit?.({ document, itemDescription });
          }
        }}
      >
        <i class="fas fa-feather fa-fw"></i>
      </a>
    {/if}
    <GoldHeaderUnderline />
  </header>

  <!-- Body -->
  <ExpandableContainer {expanded}>
    {#key itemDescription.enriched}
      <div class="editor">
        <div data-target={itemDescription.field} class="user-select-text">
          {@html itemDescription.enriched}
        </div>
      </div>
    {/key}
  </ExpandableContainer>
</section>
