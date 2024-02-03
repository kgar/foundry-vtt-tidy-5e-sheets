<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';

  let open: boolean = true;
</script>

<section
  class="item-table"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_TABLE}
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="item-table-head" on:click={(ev) => (open = !open)}>
    <slot name="header" />
  </div>
  <ExpandableContainer expanded={open}>
    <div class="item-table-body">
      <slot name="body" />
    </div>
  </ExpandableContainer>
</section>

<style lang="scss">
  .item-table-head {
    cursor: pointer;
  }
</style>
