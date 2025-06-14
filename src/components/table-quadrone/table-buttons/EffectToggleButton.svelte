<script lang="ts">
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActiveEffect5e } from 'src/types/types';

  interface Props {
    effect: ActiveEffect5e;
    doc: any;
  }

  let { effect, doc }: Props = $props();

  let title = $derived(
    FoundryAdapter.localize(
      effect.disabled ? 'DND5E.EffectEnable' : 'DND5E.EffectDisable',
    ),
  );

  const localize = FoundryAdapter.localize;

  let isConcentration = $derived(
    doc.actor && FoundryAdapter.isConcentrationEffect(effect, doc.actor.sheet),
  );

  $inspect({
    isConcentration,
    doc,
    effect,
  });

  function endConcentration() {}
</script>

{#if isConcentration}
  <a
    class="tidy-table-button"
    onclick={() => endConcentration()}
    title={localize('DND5E.ConcentrationBreak')}
  >
    <Dnd5eIcon src={`systems/dnd5e/icons/svg/break-concentration.svg`} />
  </a>
{:else}
  <a
    class="tidy-table-button"
    {title}
    onclick={() => effect.update({ disabled: !effect.disabled })}
  >
    <i
      class={[
        'fas',
        {
          ['fa-toggle-off']: effect.disabled,
          ['fa-toggle-large-on']: !effect.disabled,
        },
      ]}
    ></i>
  </a>
{/if}
