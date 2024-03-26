<!-- 
  @component
For effects only.
A special item control which swaps between an Enable/Disable control and a special "Break Concentration" control.
Because the controls are mutually exclusive, it is more ergonomic to distinguish them in this component than to try to smartly toggle them inline while spinning up item controls for a give Effects component.
 -->
<script lang="ts">
  import type { ActiveEffect5e, ActorSheetContext } from 'src/types/types';
  import ItemControl from './ItemControl.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let effect: ActiveEffect5e;

  $: actualEffect =
    effect instanceof dnd5e.documents.ActiveEffect5e
      ? effect
      : FoundryAdapter.getEffect({
          document: $context.actor,
          effectId: effect.id,
          parentId: effect.parentId,
        });

  let context = getContext<Readable<ActorSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  $: isConcentration = FoundryAdapter.isConcentrationEffect(
    actualEffect,
    $context.actor.sheet,
  );
</script>

{#if isConcentration}
  <ItemControl
    iconSrc={`systems/dnd5e/icons/svg/break-concentration.svg`}
    onclick={() => $context.actor.endConcentration(actualEffect)}
    title={localize('DND5E.ConcentrationBreak')}
  />
{:else}
  <ItemControl
    iconCssClass={`fas ${actualEffect.disabled ? 'fa-check' : 'fa-times'}`}
    onclick={() => actualEffect.update({ disabled: !actualEffect.disabled })}
    title={actualEffect.disabled
      ? localize('DND5E.EffectEnable')
      : localize('DND5E.EffectDisable')}
  />
{/if}
