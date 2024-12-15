<script lang="ts">
  import ItemDescriptions from '../../shared/ItemDescriptions.svelte';
  import { getContainerSheetHightouchContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getContainerSheetHightouchContext());
</script>

<ItemDescriptions
  document={context.document}
  itemDescriptions={context.itemDescriptions}
/>
