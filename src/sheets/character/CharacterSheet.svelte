<script lang="ts">
  import type { CharacterSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import CharacterSheetFull from './CharacterSheetFull.svelte';
  import CharacterSheetLimited from './CharacterSheetLimited.svelte';

  let context = getContext<Readable<CharacterSheetContext>>('context');
</script>

{#if $context.showLimitedSheet}
  <CharacterSheetLimited />
{:else}
  <CharacterSheetFull />
{/if}
