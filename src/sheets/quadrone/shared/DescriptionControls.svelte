<script lang="ts">
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ClassValue } from 'svelte/elements';

  /**
   * Menu, copy, and [optional] edit buttons for a description.
   * The parent element heeds `[data-prop]` and `[data-context-menu]` 
   * for the copy action and the descriptions context menu to read from.
   */
  interface Props {
    /** When provided, an edit button is rendered which calls this function. */
    onEdit?: () => void;
    editLabel?: string;
    buttonClass?: ClassValue;
  }

  const localize = FoundryAdapter.localize;

  let {
    onEdit,
    editLabel = localize('DND5E.DescriptionEdit', {
      description: localize('DND5E.Description'),
    }),
    buttonClass = 'button button-borderless button-icon-only flexshrink',
  }: Props = $props();
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<a
  class={[buttonClass, 'menu']}
  aria-label={localize('DND5E.AdditionalControls')}
  data-tooltip=""
  role="button"
  tabindex="0"
  data-action="showContextMenu"
  data-target-selector="[data-context-menu]"
  {@attach InputAttachments.triggerClickOnKeydown}
>
  <i class="fa-solid fa-ellipsis-vertical fa-fw"></i>
</a>
<!-- svelte-ignore a11y_missing_attribute -->
<a
  class={[buttonClass, 'copy']}
  aria-label={localize('TIDY5E.COMMON.Action.CopyToClipboard')}
  data-tooltip=""
  role="button"
  tabindex="0"
  data-action="copyData"
  {@attach InputAttachments.triggerClickOnKeydown}
>
  <i class="fa-solid fa-copy fa-fw"></i>
</a>
{#if onEdit}
  <!-- svelte-ignore a11y_missing_attribute, a11y_click_events_have_key_events -->
  <a
    class={[buttonClass, 'edit']}
    aria-label={editLabel}
    data-tooltip=""
    role="button"
    tabindex="0"
    onclick={() => onEdit()}
    {@attach InputAttachments.triggerClickOnKeydown}
  >
    <i class="fa-solid fa-feather fa-fw"></i>
  </a>
{/if}
