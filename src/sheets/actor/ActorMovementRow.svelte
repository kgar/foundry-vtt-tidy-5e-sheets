<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Actor5e } from 'src/types/actor';
  import type {
    CharacterSheetContext,
    NpcSheetContext,
    VehicleSheetContext,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let movement: any;
  export let actor: Actor5e;

  let store =
    getContext<
      Readable<CharacterSheetContext | NpcSheetContext | VehicleSheetContext>
    >('store');

  const localize = FoundryAdapter.localize;
</script>

<section class="movement flex-row small-gap">
  <h4>{localize('DND5E.Speed')}</h4>
  {#if movement.primary}
    <span title={movement.primary}>{movement.primary}</span>
  {/if}
  {#if movement.special}
    |
    <span title={movement.special}>{movement.special}</span>
  {/if}
  {#if !$store.lockSensitiveFields}
    <a
      class="configure"
      title={localize('DND5E.MovementConfig')}
      on:click={() =>
        new dnd5e.applications.actor.ActorMovementConfig(actor).render(true)}
      ><i class="fas fa-cog" /></a
    >
  {/if}
</section>

<style lang="scss">
  .movement {
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    padding: 0.1875rem 0 0.125rem 0.25rem;
    font-size: 0.875rem;
    line-height: 1;

    &:not(:hover) .configure {
      opacity: 0;
    }

    .configure i {
      font-size: 0.75rem;
      color: var(--t5ek-tertiary-color);
      transition: color 0.3s ease;
      cursor: pointer;
    }

    .configure:hover i {
      color: var(--t5ek-secondary-color);
    }
  }
</style>
