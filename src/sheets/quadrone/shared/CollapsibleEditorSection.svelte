<script lang="ts">
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { isNil } from 'src/utils/data';
  import GoldHeaderUnderline from './GoldHeaderUnderline.svelte';
  import type { ItemDescription } from 'src/types/item.types';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import DescriptionControls from './DescriptionControls.svelte';
  import { CONSTANTS } from 'src/constants';

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
    <!-- svelte-ignore a11y_missing_attribute, a11y_click_events_have_key_events -->
    <a
      class="title"
      onclick={() => (expanded = !expanded)}
      role="button"
      tabindex="0"
      {@attach InputAttachments.triggerClickOnKeydown}
    >
      <!-- Title -->
      {itemDescription.label}
      {#if hasContent}
        <!-- Expand Indicator, if there's nonblank content -->
        <i class={['fas fa-angle-right fa-fw expand-indicator', { expanded }]}
        ></i>
      {/if}
    </a>
    <DescriptionControls
      buttonClass={['control', 'button-icon-only']}
      onEdit={!disabled
        ? () => onEdit?.({ document, itemDescription })
        : undefined}
    />
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
