<script lang="ts">
  import { type Snippet } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyTableRow from '../table-quadrone/TidyTableRow.svelte';
  import type { AdvancementItemContext, Item5e } from 'src/types/item.types';
    import { isUserInteractable } from 'src/utils/element';

  interface Props {
    advancement: AdvancementItemContext;
    item: Item5e;
    rowClass?: string;
    hidden?: boolean;
    attributes?: Record<string, any>;
    children?: Snippet;
    afterRow?: Snippet;
    expanded?: boolean;
  }

  let {
    advancement,
    item,
    rowClass = '',
    hidden = false,
    attributes,
    children,
    afterRow: insideAfterRowSnippet,
    expanded = $bindable(false),
  }: Props = $props();

  let doc = $derived(item.advancement?.byId[advancement.id]);

  function handleDragStart(event: DragEvent) {
    if (event.target !== event.currentTarget) {
      // Allow for draggables within this containing element to be handled elsewhere.
      return;
    }

    const dragData = doc?.toDragData?.();
    if (dragData) {
      event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
    }
  }
</script>

<TidyTableRow
  rowContainerAttributes={{
    ['data-id']: advancement?.id,
  }}
  rowContainerClass="activity"
  rowClass="tidy-table-row-v2 {rowClass} {expanded ? 'expanded' : ''}"
  rowAttributes={{
    ['data-tidy-always-draggable']: '',
    ['data-tidy-table-row']: '',
    ['data-tidy-sheet-part']: CONSTANTS.SHEET_PARTS.ADVANCEMENT_TABLE_ROW,
  }}
  {hidden}
  ondblclick={(event) =>
    event.target instanceof HTMLElement &&
    !isUserInteractable(event.target) &&
    doc &&
    FoundryAdapter.editOnMouseEvent(event, doc)}
  onmousedown={(event) => doc && FoundryAdapter.editOnMiddleClick(event, doc)}
  ondragstart={handleDragStart}
  {...attributes}
>
  {@render children?.()}

  {#snippet afterRow()}
    {@render insideAfterRowSnippet?.()}
  {/snippet}
</TidyTableRow>
