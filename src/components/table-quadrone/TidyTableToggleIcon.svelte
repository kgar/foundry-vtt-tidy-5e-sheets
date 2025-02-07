<script lang="ts">
  import { CONSTANTS } from 'src/constants';

  interface Props {
    expanded?: boolean;
  }

  let { expanded = true }: Props = $props();
</script>

<div class="button expand-button" class:expanded>
  <i
    class="fa-solid fa-chevron-right"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.EXPANSION_TOGGLE}
  ></i>
</div>
