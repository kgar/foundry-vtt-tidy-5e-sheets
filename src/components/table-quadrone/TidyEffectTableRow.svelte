<script lang="ts">
  import { type OnItemToggledFn } from 'src/types/types';
  import { getContext, type Snippet } from 'svelte';
  import type { ActiveEffect5e, ActiveEffectContext } from 'src/types/types';
  import { CONSTANTS } from 'src/constants';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import TidyEffectSummary from './TidyEffectSummary.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyTableRow from '../table-quadrone/TidyTableRow.svelte';

  interface Props {
    activeEffect?: ActiveEffect5e | ActiveEffectContext | null;
    contextMenu?: { type: string; uuid: string } | null;
    rowClass?: string;
    hidden?: boolean;
    attributes?: Record<string, any>;
    draggable?: boolean;
    children?: Snippet<[{ toggleSummary: () => void; expanded: boolean }]>;
    expanded?: boolean;
  }

  let {
    activeEffect = null,
    contextMenu = null,
    rowClass = '',
    draggable = true,
    hidden = false,
    attributes,
    children,
    expanded = $bindable(false),
  }: Props = $props();

  let effectDocument = $derived(activeEffect?.effect ?? activeEffect);

  const onEffectToggled = getContext<OnItemToggledFn>(
    CONSTANTS.SVELTE_CONTEXT.ON_ITEM_TOGGLED,
  );

  const location = getContext<string>(CONSTANTS.SVELTE_CONTEXT.LOCATION);

  async function toggleSummary() {
    expanded = !expanded;
    onEffectToggled?.(effectDocument.id, expanded, location);
  }

  function handleDragStart(event: DragEvent) {
    const dragData = effectDocument.toDragData?.();
    if (dragData) {
      event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
    }
  }
</script>

<TidyTableRow
  rowContainerAttributes={{
    ['data-effect-id']: effectDocument?.id,
  }}
  rowClass="tidy-table-row-v2 {rowClass} {expanded ? 'expanded' : ''}"
  rowAttributes={{
    ['data-context-menu']: CONSTANTS.CONTEXT_MENU_TYPE_EFFECTS,
    ['data-tidy-table-row']: '',
    ['data-tidy-sheet-part']: CONSTANTS.SHEET_PARTS.EFFECT_TABLE_ROW,
    ['data-info-card']: 'effect',
    ['data-info-card-entity-uuid']: activeEffect.uuid,
    ['data-parent-id']: activeEffect?.parentId ?? activeEffect?.parent?.id,
    draggable: draggable,
  }}
  {hidden}
  onmousedown={(event) =>
    FoundryAdapter.editOnMiddleClick(event, effectDocument)}
  ondragstart={handleDragStart}
  {...attributes}
>
  {@render children?.({ toggleSummary, expanded: expanded })}

  {#snippet afterRow()}
    <ExpandableContainer {expanded}>
      <TidyEffectSummary activeEffect={effectDocument} />
    </ExpandableContainer>
  {/snippet}
</TidyTableRow>
