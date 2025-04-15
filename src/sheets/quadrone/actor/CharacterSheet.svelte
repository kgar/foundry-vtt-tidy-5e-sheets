<script lang="ts">
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());
</script>

Hello world!

<p>
  TODO: Do something awesome for actor {context.rootId}
</p>
