<script lang="ts">
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemSheetQuadroneContext } from 'src/types/item.types';
  import type {
    ActiveEffect5e,
    ActorSheetQuadroneContext,
  } from 'src/types/types';

  interface Props {
    effect: ActiveEffect5e;
  }

  let { effect }: Props = $props();

  let context =
    $derived(
      getSheetContext<ActorSheetQuadroneContext | ItemSheetQuadroneContext>(),
    );

  let title = $derived(
    FoundryAdapter.localize(
      effect.disabled ? 'DND5E.EffectEnable' : 'DND5E.EffectDisable',
    ),
  );

  let isConcentration = $derived(
    'actor' in context &&
      FoundryAdapter.isConcentrationEffect(effect, context.actor.sheet),
  );
</script>

{#if isConcentration}
  <a
    class="tidy-table-button"
    data-action="toggle"
    data-tooltip={'DND5E.ConcentrationBreak'}
  >
    <Dnd5eIcon src={`systems/dnd5e/icons/svg/break-concentration.svg`} />
  </a>
{:else}
  <a
    class={[
      'tidy-table-button tidy-table-toggle',
      { disabled: !context.editable },
    ]}
    data-tooltip={title}
    data-action="toggle"
  >
    <i
      class={[
        'fa-solid',
        {
          ['fa-toggle-off']: effect.disabled,
          ['fa-toggle-large-on enabled']: !effect.disabled,
        },
      ]}
    ></i>
  </a>
{/if}
