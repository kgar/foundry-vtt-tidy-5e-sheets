<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetContext,
    NpcSheetContext,
    SpecialTraits,
  } from 'src/types/types';

  let context =
    $derived(getSheetContext<CharacterSheetContext | NpcSheetContext>());

  let flags = $derived(context.flags);
</script>

Hai.
