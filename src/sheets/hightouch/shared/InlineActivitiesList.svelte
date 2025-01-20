<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import type { Activity5e } from 'src/foundry/dnd5e.types';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import type { TidyTableColumns } from 'src/components/table/TidyTable.svelte';

  interface Props {
    item?: Item5e | null;
    inlineToggleService: InlineToggleService;
  }

  let { item = null, inlineToggleService }: Props = $props();

  let toggleServiceMap = $derived(inlineToggleService.map);

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  const gridTemplateColumns: TidyTableColumns = [
    {
      name: 'Name',
      width: '1fr',
    },
    {
      name: 'Uses',
      width: '5rem',
    },
    {
      name: 'Usage',
      width: '5rem',
    },
  ];

  function rollActivity(activity: Activity5e, event: MouseEvent) {
    activity.use({ event });
  }

  function getActivityUsageLabel(activity: Activity5e) {
    return (
      // @ts-expect-error
      CONFIG.DND5E.activityActivationTypes[activity.activation.type]?.label ??
      activity.activation.type
    );
  }
</script>

<ExpandableContainer
  expanded={toggleServiceMap.get(tabId)?.has(item.id) === true}
>
  Activities List Here! 💪🏋️‍♂️
</ExpandableContainer>
