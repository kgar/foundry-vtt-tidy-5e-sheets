<script lang="ts">
  import { type OnItemToggledFn } from 'src/types/types';
  import { getContext, type Snippet } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyTableRow from '../table-quadrone/TidyTableRow.svelte';
  import TidyActivitySummary from './TidyActivitySummary.svelte';
  import type { ActivityQuadroneContext } from 'src/types/item.types';
  import { Activities } from 'src/features/activities/activities';
  import { isUserInteractable } from 'src/utils/element';

  interface Props {
    activity: ActivityQuadroneContext;
    rowClass?: string;
    hidden?: boolean;
    attributes?: Record<string, any>;
    children?: Snippet<[{ toggleSummary: () => void; expanded: boolean }]>;
    expanded?: boolean;
  }

  let {
    activity,
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
    onActivityToggled?.(activity.id, expanded, location);
  }

  function handleDragStart(event: DragEvent) {
    if (event.target !== event.currentTarget) {
      // Allow for draggables within this containing element to be handled elsewhere.
      return;
    }

    const dragData = activity.doc.toDragData?.();
    if (dragData) {
      event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
    }
  }

  let configurable = $derived(Activities.isConfigurable(activity.doc));
</script>

<TidyTableRow
  rowContainerAttributes={{
    ['data-activity-id']: activity?.id,
    ['data-configurable']: configurable,
  }}
  rowContainerClass="activity"
  rowClass="tidy-table-row-v2 {rowClass} {expanded ? 'expanded' : ''}"
  rowAttributes={{
    ['data-tidy-table-row']: '',
    ['data-tidy-always-draggable']: '',
    ['data-tidy-sheet-part']: CONSTANTS.SHEET_PARTS.ACTIVITY_TABLE_ROW,
    ['data-info-card']: 'activity',
    ['data-info-card-entity-uuid']: activity.uuid,
    ['data-context-menu']: CONSTANTS.CONTEXT_MENU_TYPE_ACTIVITIES,
  }}
  {hidden}
  ondblclick={(event) =>
    event.target instanceof HTMLElement &&
    !isUserInteractable(event.target) &&
    activity &&
    FoundryAdapter.editOnMouseEvent(event, activity.doc)}
  onmousedown={(event) => FoundryAdapter.editOnMiddleClick(event, activity.doc)}
  ondragstart={handleDragStart}
  {...attributes}
>
  {@render children?.({ toggleSummary, expanded: expanded })}

  {#snippet afterRow()}
    <ExpandableContainer {expanded}>
      <TidyActivitySummary {activity} />
    </ExpandableContainer>
  {/snippet}
</TidyTableRow>
