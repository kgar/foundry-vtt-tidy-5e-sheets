<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSheetContextV1 } from 'src/types/types';

  interface Props {
    movementLabelKey?: string;
    [key: string]: any;
  }

  let { movementLabelKey = 'DND5E.Speed', ...rest }: Props = $props();

  let context = $derived(getSheetContext<ActorSheetContextV1>());

  const localize = FoundryAdapter.localize;
</script>

<section class="actor-movement flex-row small-gap {rest.class ?? ''}">
  <strong>{localize(movementLabelKey)}</strong>
  {#if context.movement.primary}
    <span title={context.movement.primary}>{context.movement.primary}</span>
  {/if}
  {#if context.movement.special}
    |
    <span title={context.movement.special}>{context.movement.special}</span>
  {/if}
  {#if context.movement.secondary}
    |
    <span title={context.movement.secondary}
      >{context.movement.secondary}</span
    >
  {/if}
  {#if context.unlocked}
    <button
      type="button"
      class="configure inline-icon-button"
      title={localize('DND5E.MOVEMENT.Action.Configure')}
      onclick={() =>
        FoundryAdapter.renderMovementSensesConfig(context.actor, 'movement')}
      tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
      ><i class="fas fa-cog"></i></button
    >
  {/if}
</section>
