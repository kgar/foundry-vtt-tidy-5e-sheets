<script lang="ts">
  import type { ActorSheetQuadroneContext } from 'src/types/types';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import SpellPipQuadrone from './SpellPipQuadrone.svelte';

  interface Props {
    prop: string;
    uses: number | undefined;
    max: number | undefined;
  }

  let { prop, uses = 0, max = 0 }: Props = $props();

  let context = $derived(getSheetContext<ActorSheetQuadroneContext>());

  let totalPips = $derived(Math.max(uses, max));
</script>

<div class="pips spell-pips">
  {#each { length: totalPips }, index}
    <SpellPipQuadrone
      editable={context.editable}
      empty={index >= uses}
      {index}
      temp={index >= max}
      {prop}
    />
  {/each}

  <!-- 
    .pip-end is a target that can be used via combinators
    to help visualize the potential pip adjustment before
    clicking.
  -->
  <span class="pip-end"></span>
</div>
