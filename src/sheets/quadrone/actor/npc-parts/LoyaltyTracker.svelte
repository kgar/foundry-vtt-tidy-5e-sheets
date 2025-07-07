<script lang="ts">
  import NpcScoreTrackerCard from './NpcScoreTrackerCard.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getNpcSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  const localize = FoundryAdapter.localize;

  let context = $derived(getNpcSheetQuadroneContext());

  let loyaltyValue = $derived(context.system.attributes.loyalty.value);
  let loyaltyMax = $derived(
    context.system.schema.fields.attributes.fields.loyalty.fields.value.max,
  );
</script>

{#if context.showLoyaltyTracker}
  <NpcScoreTrackerCard
    actor={context.actor}
    label={localize('DND5E.Loyalty')}
    value={loyaltyValue}
    valuePath="system.attributes.loyalty.value"
    max={loyaltyMax}
    unlocked={context.unlocked}
  />
{/if}
