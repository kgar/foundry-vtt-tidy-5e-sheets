<script lang="ts">
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import ActorConditionsQuadrone from '../parts/ActorConditionsQuadrone.svelte';
  import EffectsTables from '../../shared/EffectsTables.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());
</script>

<div class="tidy-table-container">
  <EffectsTables
    doc={context.actor}
    editable={context.editable}
    effects={context.effects}
    unlocked={context.unlocked}
  />

  {#if context.conditions}
    <ActorConditionsQuadrone conditions={context.conditions} />
  {/if}
</div>
