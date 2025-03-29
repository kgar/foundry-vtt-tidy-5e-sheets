<script lang="ts">
  import { type Snippet } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyTableRow from '../table-quadrone/TidyTableRow.svelte';
  import type { AdvancementItemContext, Item5e } from 'src/types/item.types';

  interface Props {
    advancement: AdvancementItemContext;
    item: Item5e;
    rowClass?: string;
    hidden?: boolean;
    attributes?: Record<string, any>;
    draggable?: boolean;
    children?: Snippet;
    afterRow?: Snippet;
    expanded?: boolean;
  }

  let {
    advancement,
    item,
    rowClass = '',
    draggable = true,
    hidden = false,
    attributes,
    children,
    afterRow: insideAfterRowSnippet,
    expanded = $bindable(false),
  }: Props = $props();

  let doc = $derived(item.advancement?.byId[advancement.id]);

  function handleDragStart(event: DragEvent) {
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
    ['data-id']: advancement?.id,
    ['data-tidy-table-row']: '',
    ['data-tidy-sheet-part']: CONSTANTS.SHEET_PARTS.ADVANCEMENT_TABLE_ROW,
    draggable: draggable,
  }}
  {hidden}
  ondblclick={(event) => doc && FoundryAdapter.editOnMouseEvent(event, doc)}
  onmousedown={(event) => doc && FoundryAdapter.editOnMiddleClick(event, doc)}
  ondragstart={handleDragStart}
  {...attributes}
>
  {@render children?.()}

  {#snippet afterRow()}
    {@render insideAfterRowSnippet?.()}
  {/snippet}
</TidyTableRow>
