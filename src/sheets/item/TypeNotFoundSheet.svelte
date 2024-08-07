<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<h2>Item Type Not Found</h2>

<p>
  The item type <code>{$context.item.type}</code> does not have a sheet in Tidy
  5e Sheets. Please request any item type sheets in an issue on the
  <a
    target="_blank"
    href="https://github.com/kgar/foundry-vtt-tidy-5e-sheets/issues"
    >Tidy 5e github repository</a
  >.
</p>
