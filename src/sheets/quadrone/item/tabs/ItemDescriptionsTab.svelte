<script lang="ts">
  import ItemDescriptions from '../../shared/ItemDescriptions.svelte';
  import { getContainerSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getContainerSheetQuadroneContext());
</script>

<ItemDescriptions
  document={context.document}
  itemDescriptions={context.itemDescriptions}
/>
