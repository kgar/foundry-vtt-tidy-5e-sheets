<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { ExpandCollapseService } from 'src/features/expand-collapse/ExpandCollapseService';
  import { declareLocation } from 'src/types/location-awareness';
  import { ExpandAllCollapseAllService } from 'src/features/expand-collapse/ExpandAllCollapseAllService';
  import { isNil } from 'src/utils/data';

  export let location: string;
  export let toggleable: boolean = true;

  declareLocation('item-table', location);
  
  const expandCollapseService = ExpandCollapseService.initService(toggleable);
  
  $: expandedState = expandCollapseService.state;

  const expandAllCollapseAllSignal = ExpandAllCollapseAllService.getSignal();

  $: {
    // First-time use, it should not toggle anything.
    const isInitialValue = isNil($expandAllCollapseAllSignal?.command, '');
    if (!isInitialValue) {
      expandCollapseService.set(
        $expandAllCollapseAllSignal?.command === 'expand',
      );
    }
  }
</script>

<section
  class="item-table"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_TABLE}
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <slot name="header" />
  <ExpandableContainer expanded={$expandedState.expanded}>
    <div class="item-table-body">
      <slot name="body" />
    </div>
  </ExpandableContainer>
</section>
