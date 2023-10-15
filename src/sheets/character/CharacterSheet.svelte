<script lang="ts">
  import type { CharacterSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import CharacterSheetFull from './CharacterSheetFull.svelte';
  import CharacterSheetLimited from './CharacterSheetLimited.svelte';

  let context = getContext<Readable<CharacterSheetContext>>('context');
  export let selectedTabId: string;
</script>

{#if $context.showLimitedSheet}
  <CharacterSheetLimited />
{:else}
  <CharacterSheetFull {selectedTabId} />
{/if}
