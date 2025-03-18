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
    cssClass?: string;
    contextMenu?: { type: string; uuid: string } | null;
    hidden?: boolean;
    attributes?: Record<string, any>;
    draggable?: boolean;
    children?: Snippet<[any]>;
  }

  let {
    activeEffect = null,
    contextMenu = null,
    cssClass = '',
    draggable = true,
    hidden = false,
    attributes,
    children,
  }: Props = $props();

  let effectDocument = $derived(activeEffect?.effect ?? activeEffect);

  const onEffectToggled = getContext<OnItemToggledFn>(
    CONSTANTS.SVELTE_CONTEXT.ON_ITEM_TOGGLED,
  );

  const location = getContext<string>(CONSTANTS.SVELTE_CONTEXT.LOCATION);

  let showSummary = $state(false);

  async function toggleSummary() {
    showSummary = !showSummary;
    onEffectToggled?.(effectDocument.id, showSummary, location);
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
  rowClass="tidy-table-row-v2"
  rowAttributes={{
    ['data-context-menu']: contextMenu?.type,
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
  <div class="effect-table-row {cssClass ?? ''}">
    {@render children?.({ toggleSummary })}
  </div>
  <ExpandableContainer expanded={showSummary}>
    <TidyEffectSummary activeEffect={effectDocument} />
  </ExpandableContainer>
</TidyTableRow>
