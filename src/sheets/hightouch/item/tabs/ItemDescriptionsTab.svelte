<script lang="ts">
  import { getContext } from 'svelte';
  import ItemDescriptions from '../../shared/ItemDescriptions.svelte';
  import type { Readable } from 'svelte/store';
  import { CONSTANTS } from 'src/constants';
  import type { ContainerSheetHightouchContext } from 'src/types/item.types';

  let context = getContext<Readable<ContainerSheetHightouchContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<ItemDescriptions
  document={$context.document}
  itemDescriptions={$context.itemDescriptions}
/>
