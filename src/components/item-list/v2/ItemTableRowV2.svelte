<script lang="ts">
  import { CONSTANTS } from 'src/constants';

  export let hidden: boolean = false;
</script>

<div class="tidy-table-row-container">
  <div
    class="tidy-table-row {$$restProps.class ?? ''}"
    class:hidden
    aria-hidden={hidden}
    data-tidy-table-row
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TABLE_ROW}
  >
    <slot />
  </div>
</div>
