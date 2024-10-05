<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let movementLabelKey: string = 'DND5E.Speed';

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<section class="actor-movement flex-row small-gap {$$restProps.class ?? ''}">
  <strong>{localize(movementLabelKey)}</strong>
  {#if $context.movement.primary}
    <span title={$context.movement.primary}>{$context.movement.primary}</span>
  {/if}
  {#if $context.movement.special}
    |
    <span title={$context.movement.special}>{$context.movement.special}</span>
  {/if}
  {#if $context.movement.secondary}
    |
    <span title={$context.movement.secondary}
      >{$context.movement.secondary}</span
    >
  {/if}
  {#if $context.unlocked}
    <!-- svelte-ignore a11y-missing-attribute -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <a
      class="configure inline-icon-button inline-flex-row align-items-center"
      title={localize('DND5E.MovementConfig')}
      on:click={() => FoundryAdapter.renderActorMovementConfig($context.actor)}
      ><i class="fas fa-cog" />
    </a>
  {/if}
</section>
