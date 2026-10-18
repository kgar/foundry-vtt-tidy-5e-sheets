<script lang="ts">
  import { ItemCompendiumBrowse } from 'src/features/compendium/ItemCompendiumBrowse';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    class?: ClassValue;
    sheetDocument: any;
    /** Source tab we're searching for items to add in. */
    tabId: string;
    /** Section creation data passed to `_addDocument`. */
    data?: Record<string, any>;
    /** Icon-only button or not, if using for empty states. */
    iconOnly?: boolean;
  }

  let {
    class: classValue,
    sheetDocument,
    tabId,
    data,
    iconOnly = false,
  }: Props = $props();

  let types = $derived<string[]>(
    sheetDocument.sheet._browseAddDocumentItemTypes(tabId, data?.type),
  );

  // Hide the button if users don't have any compendiums with the browsable item types.
  let canBrowse = $derived(ItemCompendiumBrowse.canBrowse(types));

  let label = $derived(ItemCompendiumBrowse.getLabel(types));
</script>

{#if canBrowse}
  <button
    type="button"
    class={['button', { 'button-icon-only': iconOnly }, classValue]}
    aria-label={iconOnly ? label : undefined}
    data-tooltip={iconOnly ? '' : undefined}
    onclick={(event) =>
      sheetDocument.sheet._browseAddDocument({ event, tabId, data })}
  >
    <i class="fas fa-book-atlas"></i>
    {#if !iconOnly}
      {label}
    {/if}
  </button>
{/if}
