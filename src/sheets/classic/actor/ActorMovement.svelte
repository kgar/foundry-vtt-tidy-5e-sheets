<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings.svelte';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  interface Props {
    movementLabelKey?: string;
    [key: string]: any;
  }

  let { movementLabelKey = 'DND5E.Speed', ...rest }: Props = $props();

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<section class="actor-movement flex-row small-gap {rest.class ?? ''}">
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
    <button
      type="button"
      class="configure inline-icon-button"
      title={localize('DND5E.MovementConfig')}
      onclick={() =>
        FoundryAdapter.renderMovementSensesConfig($context.actor, 'movement')}
      tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
      ><i class="fas fa-cog"></i></button
    >
  {/if}
</section>
