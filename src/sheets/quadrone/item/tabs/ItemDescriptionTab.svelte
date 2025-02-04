<script lang="ts">
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import ItemDescriptions from '../../shared/ItemDescriptions.svelte';

  let context = $derived(getItemSheetContextQuadrone());
</script>

<ItemDescriptions
  document={context.document}
  itemDescriptions={context.itemDescriptions}
/>
