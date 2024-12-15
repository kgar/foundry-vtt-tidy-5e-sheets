<!-- 
  @component
For effects only.
A special item control which swaps between an Enable/Disable control and a special "Break Concentration" control.
Because the controls are mutually exclusive, it is more ergonomic to distinguish them in this component than to try to smartly toggle them inline while spinning up item controls for a give Effects component.
 -->
<script lang="ts">
  import type { ActiveEffect5e, ActorSheetContextV1 } from 'src/types/types';
  import ItemControl from './ItemControl.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    effect: ActiveEffect5e;
  }

  let { effect }: Props = $props();

  let context = $derived(getSheetContext<ActorSheetContextV1>());

  /** Character effects are not the full ActiveEffect5e instance;
   * they are instead a subset of contextual data.
   * Also, there are cases when, such as with deleting effects,
   * that this logic fires immediately as an effect deletion is occurring.
   * This seems related specifically to character sheets.
   */
  let actualEffect = $derived(
    effect instanceof dnd5e.documents.ActiveEffect5e
      ? effect
      : !!effect
        ? FoundryAdapter.getEffect({
            document: context.actor,
            effectId: effect.id,
            parentId: effect.parentId,
          })
        : undefined,
  );

  const localize = FoundryAdapter.localize;

  let isConcentration = $derived(
    FoundryAdapter.isConcentrationEffect(actualEffect, context.actor.sheet),
  );
</script>

{#if actualEffect}
  {#if isConcentration}
    <ItemControl
      iconSrc={`systems/dnd5e/icons/svg/break-concentration.svg`}
      onclick={() => context.actor.endConcentration(actualEffect)}
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
{:else}
  <span>&nbsp;</span>
{/if}
