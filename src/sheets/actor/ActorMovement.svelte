<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ActorSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<section class="movement flex-row small-gap {$$restProps.class ?? ''}">
  <h4>{localize('DND5E.Speed')}</h4>
  {#if $context.movement.primary}
    <span title={$context.movement.primary}>{$context.movement.primary}</span>
  {/if}
  {#if $context.movement.special}
    |
    <span title={$context.movement.special}>{$context.movement.special}</span>
  {/if}
  {#if $context.unlocked}
    <button
      type="button"
      class="configure inline-icon-button"
      title={localize('DND5E.MovementConfig')}
      on:click={() => FoundryAdapter.renderActorMovementConfig($context.actor)}
      tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
      ><i class="fas fa-cog" /></button
    >
  {/if}
</section>

<style lang="scss">
  .movement {
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    padding: 0.1875rem 0 0.125rem 0.25rem;
    font-size: 0.75rem;
    line-height: 1rem;

    .configure {
      font-size: 0.75rem;
    }
  }
</style>
