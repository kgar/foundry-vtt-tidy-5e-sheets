<script lang="ts">
  import {
    type ActivityItemContext,
    type OnItemToggledFn,
  } from 'src/types/types';
  import { getContext, type Snippet } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyTableRow from '../table-quadrone/TidyTableRow.svelte';
  import TidyActivitySummary from './TidyActivitySummary.svelte';
  import { Activities } from 'src/features/activities/activities';
  import { isUserInteractable } from 'src/utils/element';

  interface Props {
    ctx: ActivityItemContext;
    rowClass?: string;
    hidden?: boolean;
    attributes?: Record<string, any>;
    children?: Snippet<[{ toggleSummary: () => void; expanded: boolean }]>;
    expanded?: boolean;
  }

  let {
    ctx,
    rowClass = '',
    hidden = false,
    attributes,
    children,
    expanded = $bindable(false),
  }: Props = $props();

  const onActivityToggled = getContext<OnItemToggledFn>(
    CONSTANTS.SVELTE_CONTEXT.ON_ITEM_TOGGLED,
  );

  const location = getContext<string>(CONSTANTS.SVELTE_CONTEXT.LOCATION);

  async function toggleSummary() {
    expanded = !expanded;
    onActivityToggled?.(ctx.id, expanded, location);
  }

  function handleDragStart(event: DragEvent) {
    if (event.target !== event.currentTarget) {
      // Allow for draggables within this containing element to be handled elsewhere.
      return;
    }

    const dragData = ctx.activity.toDragData?.();
    if (dragData) {
      event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
    }
  }

  let configurable = $derived(Activities.isConfigurable(ctx.activity));
</script>

<TidyTableRow
  rowContainerAttributes={{
    ['data-activity-id']: ctx?.id,
    ['data-configurable']: configurable,
  }}
  rowContainerClass="activity"
  rowClass="tidy-table-row-v2 {rowClass} {expanded ? 'expanded' : ''}"
  rowAttributes={{
    ['data-tidy-table-row']: '',
    ['data-tidy-always-draggable']: '',
    ['data-tidy-sheet-part']: CONSTANTS.SHEET_PARTS.ACTIVITY_TABLE_ROW,
    ['data-info-card']: 'activity',
    ['data-info-card-entity-uuid']: ctx.activity.uuid,
    ['data-context-menu']: CONSTANTS.CONTEXT_MENU_TYPE_ACTIVITIES,
  }}
  {hidden}
  ondblclick={(event) =>
    event.target instanceof HTMLElement &&
    !isUserInteractable(event.target) &&
    ctx.activity &&
    FoundryAdapter.editOnMouseEvent(event, ctx.activity)}
  onmousedown={(event) => FoundryAdapter.editOnMiddleClick(event, ctx.activity)}
  ondragstart={handleDragStart}
  {...attributes}
>
  {@render children?.({ toggleSummary, expanded: expanded })}

  {#snippet afterRow()}
    <ExpandableContainer {expanded}>
      <TidyActivitySummary activity={ctx.activity} />
    </ExpandableContainer>
  {/snippet}
</TidyTableRow>
