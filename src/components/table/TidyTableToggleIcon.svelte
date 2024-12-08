<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { ExpandCollapseService } from 'src/features/expand-collapse/ExpandCollapseService.svelte';

  interface Props {
    expanded?: boolean;
  }

  let { expanded = true }: Props = $props();
</script>

<i
  class="expand-indicator fas fa-angle-right"
  class:expanded
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.EXPANSION_TOGGLE}
></i>
