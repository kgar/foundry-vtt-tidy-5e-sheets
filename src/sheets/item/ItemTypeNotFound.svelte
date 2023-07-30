<script lang="ts">
  import type { ItemSheetContext } from 'src/types/item';
  import type { Readable } from 'svelte/store';

  export let store: Readable<ItemSheetContext>;

  $: context = $store;

  $: context, console.log(context);
</script>

<h2>Item Type Not Found</h2>

<p>
  The item type <code>{context.item.type}</code> does not have a sheet in Tidy
  5e Sheets. Please request any item type sheets in an issue on the
  <a target="_blank" href="https://github.com/sdenec/tidy5e-sheet"
    >Tidy 5e github repository</a
  >.
</p>
