<script lang="ts">
  import { type ActivityItemContext } from 'src/types/types';
  import { type Snippet } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyTableRow from '../table-quadrone/TidyTableRow.svelte';
  import { Activities } from 'src/features/activities/activities';
  import { isUserInteractable } from 'src/utils/element';

  // Activities have no summary content yet, so this row deliberately has no
  // expand behavior. See TidyActivitySummary and the commented-out expand
  // indicator in ItemActivitiesTab for the eventual wire-up.

  interface Props {
    ctx: ActivityItemContext;
    rowClass?: string;
    hidden?: boolean;
    attributes?: Record<string, any>;
    children?: Snippet;
  }

  let {
    ctx,
    rowClass = '',
    hidden = false,
    attributes,
    children,
  }: Props = $props();

  let configurable = $derived(Activities.isConfigurable(ctx.activity));
</script>

<TidyTableRow
  rowContainerAttributes={{
    ['data-activity-id']: ctx?.id,
    ['data-item-id']: ctx?.activity.item?.id,
    ['data-configurable']: configurable,
  }}
  rowContainerClass="activity"
  rowClass="tidy-table-row-v2 {rowClass}"
  rowAttributes={{
    ['data-tidy-table-row']: '',
    ['data-tidy-always-draggable']: '',
    ['data-tidy-sheet-part']: CONSTANTS.SHEET_PARTS.ACTIVITY_TABLE_ROW,
    ['data-context-menu']: CONSTANTS.CONTEXT_MENU_TYPE_ACTIVITIES,
  }}
  {hidden}
  {...attributes}
>
  {@render children?.()}
</TidyTableRow>
