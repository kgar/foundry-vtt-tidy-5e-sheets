<script lang="ts">
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());
</script>

<h2>Item Type Not Found</h2>

<p>
  The item type <code>{context.item.type}</code> does not have a sheet in Tidy
  5e Sheets. Please request any item type sheets in an issue on the
  <a
    target="_blank"
    href="https://github.com/kgar/foundry-vtt-tidy-5e-sheets/issues"
    >Tidy 5e github repository</a
  >.
</p>
