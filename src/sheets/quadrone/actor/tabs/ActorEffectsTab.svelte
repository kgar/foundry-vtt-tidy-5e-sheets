<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import ActorConditionsQuadrone from '../parts/ActorConditionsQuadrone.svelte';
  import EffectsTables from '../../shared/EffectsTables.svelte';
  import type {
    ActorSheetQuadroneContext,
    CharacterSheetQuadroneContext,
  } from 'src/types/types';

  let context =
    $derived(
      getSheetContext<
        ActorSheetQuadroneContext | CharacterSheetQuadroneContext
      >(),
    );
</script>

<div class="tidy-table-container">
  <EffectsTables />

  {#if 'conditions' in context}
    <ActorConditionsQuadrone conditions={context.conditions} />
  {/if}
</div>
