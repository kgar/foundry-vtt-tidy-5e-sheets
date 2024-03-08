<script lang="ts">
  import { CONSTANTS } from 'src/constants';

  export let primary: boolean = false;
  export let baseWidth: string | null = null;
  export let title: string | null = null;
</script>

<div
  class="tidy-table-header-cell {$$restProps.class ?? ''}"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TABLE_HEADER_CELL}
  class:primary
  style:flex-basis={baseWidth}
  {title}
>
  <slot />
</div>
