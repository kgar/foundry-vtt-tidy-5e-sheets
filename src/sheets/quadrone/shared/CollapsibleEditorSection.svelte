<script lang="ts">
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { isNil } from 'src/utils/data';
  import GoldHeaderUnderline from './GoldHeaderUnderline.svelte';
  import type { ItemDescription } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { CONSTANTS } from 'src/constants';

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

<section
  class={['collapsible-editor', hasContent ? undefined : 'no-content']}
  data-prop={itemDescription.field}
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_DESCRIPTIONS}
>
  <!-- Header -->
  <header>
    <!-- svelte-ignore a11y_missing_attribute -->
    <a
      class="title"
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
    <a
      class={['menu', 'control', 'button-icon-only']}
      aria-label={localize('DND5E.AdditionalControls')}
      role="button"
      tabindex="0"
      data-action="showContextMenu"
      data-target-selector="[data-context-menu]"
      {@attach InputAttachments.triggerClickOnKeydown}
    >
      <i class="fa-solid fa-ellipsis-vertical fa-fw"></i>
    </a>
    <a
      class={['copy', 'control', 'button-icon-only']}
      aria-label={localize('TIDY5E.COMMON.Action.CopyToClipboard')}
      data-tooltip=""
      role="button"
      tabindex="0"
      data-action="copyData"
      {@attach InputAttachments.triggerClickOnKeydown}
    >
      <i class="fa-solid fa-copy fa-fw"></i>
    </a>
    {#if !disabled}
      <!-- Journal Edit Button -->
      <!-- svelte-ignore a11y_missing_attribute -->
      <a
        class={['edit', 'control', 'button-icon-only']}
        aria-label={localize('DND5E.DescriptionEdit', {
          description: localize('DND5E.Description'),
        })}
        onclick={() => onEdit?.({ document, itemDescription })}
        role="button"
        tabindex="0"
        {@attach InputAttachments.triggerClickOnKeydown}
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
