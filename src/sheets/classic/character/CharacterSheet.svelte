<script lang="ts">
  import CharacterSheetFull from './CharacterSheetFull.svelte';
  import CharacterSheetLimited from './CharacterSheetLimited.svelte';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getCharacterSheetContext());
</script>

{#if context.showLimitedSheet}
  <CharacterSheetLimited />
{:else}
  <CharacterSheetFull />
{/if}
