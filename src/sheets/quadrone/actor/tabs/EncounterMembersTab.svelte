<script lang="ts">
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getEncounterSheetQuadroneContext());
</script>

{#each context.members.npc as npc}
  <p>
    x{npc.quantity.value} / λ {npc.quantity.formula} | {npc.actor.name} - {npc.portrait.src}
  </p>
{/each}
