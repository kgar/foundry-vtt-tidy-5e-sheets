<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ActorConditions from 'src/sheets/classic/actor/ActorConditions.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import ActorConditionsQuadrone from '../parts/ActorConditionsQuadrone.svelte';
    import { settings } from 'src/settings/settings.svelte';
    import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
    import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
    import TidyEffectTableRow from 'src/components/table-quadrone/TidyEffectTableRow.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let effectSections = $derived(Object.values(context.effects));
</script>

{#each effectSections as section}
  {#if !section.hidden}
    {#if (context.unlocked && settings.value.limitEffectsManagementToGm) || section.effects.length > 0}
      <TidyTable key={section.label}>
        {#snippet header()}
          <TidyTableHeaderRow>
            
          </TidyTableHeaderRow>
        {/snippet}
        {#snippet body()}
          {#each section.effects as effectContext}
          <TidyEffectTableRow {effectContext}>
            
          </TidyEffectTableRow>
          {/each}
        {/snippet}
      </TidyTable>
    {/if}
  {/if}
{/each}

{#if context.conditions}
  <ActorConditionsQuadrone conditions={context.conditions} />
{/if}
