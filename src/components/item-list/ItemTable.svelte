<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { setContext } from 'svelte';
  import { ExpandCollapseService } from 'src/features/expand-collapse/ExpandCollapseService';

  export let toggleable: boolean = true;

  const expandCollapseService = new ExpandCollapseService({
    // TODO: Reference a malleable state store for whether this particular table was expanded
    expanded: true,
    toggleable,
  });

  setContext(ExpandCollapseService.contextKey, expandCollapseService);

  $: expandedState = expandCollapseService.state;
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
