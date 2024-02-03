<script lang="ts">
  import { CONSTANTS } from 'src/constants';

  let open: boolean = true;
</script>

<section
  class="item-table"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_TABLE}
>
  <div class="item-table-head" on:click={(ev) => (open = !open)}>
    <slot name="header" />
  </div>
  <div class="item-table-body-animation-wrapper" class:open>
    <div class="item-table-body">
      <slot name="body" />
    </div>
  </div>
</section>

<style lang="scss">
  .item-table-body-animation-wrapper {
    display: grid;
    grid-template-rows: 0fr;

    &.open {
      grid-template-rows: 1fr;
    }

    transition: grid-template-rows 0.2s ease;

    .item-table-body {
      overflow-y: hidden;
    }
  }

  .item-table-head {
    cursor: pointer;
  }
</style>
