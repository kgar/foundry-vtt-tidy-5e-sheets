<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { ExpandCollapseService } from 'src/features/expand-collapse/ExpandCollapseService';

  export let expanded = true;
</script>

<i
  class="expand-indicator fas fa-angle-right"
  class:expanded
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.EXPANSION_TOGGLE}
></i>