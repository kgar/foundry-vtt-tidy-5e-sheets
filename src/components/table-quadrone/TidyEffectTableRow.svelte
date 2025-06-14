<script lang="ts">
  import { type OnItemToggledFn } from 'src/types/types';
  import { getContext, type Snippet } from 'svelte';
  import type { ActiveEffectContext, EffectSummaryData } from 'src/types/types';
  import { CONSTANTS } from 'src/constants';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import TidyEffectSummary from './TidyEffectSummary.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyTableRow from '../table-quadrone/TidyTableRow.svelte';
    import { isUserInteractable } from 'src/utils/element';

  interface Props {
    effectContext: ActiveEffectContext;
    rowClass?: string;
    hidden?: boolean;
    attributes?: Record<string, any>;
    children?: Snippet<[{ toggleSummary: () => void; expanded: boolean }]>;
    expanded?: boolean;
  }

  let {
    effectContext,
    rowClass = '',
    hidden = false,
    attributes,
    children,
    expanded = $bindable(false),
  }: Props = $props();

  const onEffectToggled = getContext<OnItemToggledFn>(
    CONSTANTS.SVELTE_CONTEXT.ON_ITEM_TOGGLED,
  );

  const location = getContext<string>(CONSTANTS.SVELTE_CONTEXT.LOCATION);

  async function toggleSummary() {
    expanded = !expanded;
    onEffectToggled?.(effectContext.effect.id, expanded, location);
  }

  function handleDragStart(event: DragEvent) {
    if (event.target !== event.currentTarget) {
      // Allow for draggables within this containing element to be handled elsewhere.
      return;
    }

    const dragData = effectContext.effect.toDragData?.();
    if (dragData) {
      event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
    }
  }

  let emptySummaryData: EffectSummaryData = {
    description: {
      value: '',
    },
  };

  let summaryData = $state<EffectSummaryData | undefined>();

  $effect(() => {
    (async () => {
      if (effectContext.effect && expanded) {
        summaryData = {
          description: {
            value: await FoundryAdapter.enrichHtml(
              effectContext.effect.description ?? '',
            ),
          },
        };
      }
    })();
  });
</script>

<TidyTableRow
  rowContainerAttributes={{
    ['data-effect-id']: effectContext.id,
  }}
  rowClass="tidy-table-row-v2 {rowClass} {expanded ? 'expanded' : ''}"
  rowAttributes={{
    ['data-context-menu']: CONSTANTS.CONTEXT_MENU_TYPE_EFFECTS,
    ['data-tidy-always-draggable']: '',
    ['data-tidy-table-row']: '',
    ['data-tidy-sheet-part']: CONSTANTS.SHEET_PARTS.EFFECT_TABLE_ROW,
    ['data-info-card']: 'effect',
    ['data-info-card-entity-uuid']: effectContext.uuid,
    ['data-parent-id']: effectContext?.parentId ?? effectContext?.parent?.id,
  }}
  {hidden}
  ondblclick={(event) =>
    event.target instanceof HTMLElement &&
    !isUserInteractable(event.target) &&
    effectContext.effect &&
    FoundryAdapter.editOnMouseEvent(event, effectContext.effect)}
  onmousedown={(event) =>
    FoundryAdapter.editOnMiddleClick(event, effectContext.effect)}
  ondragstart={handleDragStart}
  {...attributes}
>
  {@render children?.({ toggleSummary, expanded: expanded })}

  {#snippet afterRow()}
    <ExpandableContainer {expanded}>
      <TidyEffectSummary
        activeEffect={effectContext.effect}
        summaryData={summaryData ?? emptySummaryData}
      />
    </ExpandableContainer>
  {/snippet}
</TidyTableRow>
