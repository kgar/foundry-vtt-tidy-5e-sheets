<script lang="ts">
  import CharacterPortrait from 'src/sheets/CharacterPortrait.svelte';
  import type { NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<NpcSheetContext>>('store');
</script>

<!-- Exhaustion -->
<CharacterPortrait actor={$store.actor} />
<!-- HP overlay -->
<!-- Optional REST? -->
<!-- Custom NPC HP -->
<!-- Temp/Map HP Boost? -->