<script lang="ts">
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());
</script>

<div class="item-weight">
  <i class="fas fa-weight-hanging item-weight-icon color-text-lightest"></i>
  <span class="item-weight-value">
    {context.system.weight?.value}
  </span>
</div>
