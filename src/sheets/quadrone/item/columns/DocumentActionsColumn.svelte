<script lang="ts">
  import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { ColumnCellProps } from 'src/runtime/item/item.types';

  let { rowDocument, rowContext, section }: ColumnCellProps = $props();

  let targetSelector = $derived(
    rowDocument.type === CONSTANTS.SHEET_TYPE_ITEM
      ? '[data-item-id]'
      : rowDocument.documentName === CONSTANTS.DOCUMENT_NAME_ACTIVITY
        ? '[data-activity-id]'
        : rowDocument.documentName === CONSTANTS.DOCUMENT_NAME_ACTIVE_EFFECT
          ? '[data-effect-id]'
          : '[data-context-menu]',
  );
</script>

{#each section.rowActions as action}
  {#if action.condition?.({ data: rowDocument, section }) ?? true}
    {@const props = action.props(rowDocument)}
    <action.component {...props} />
  {/if}
{/each}
<MenuButton {targetSelector} />
