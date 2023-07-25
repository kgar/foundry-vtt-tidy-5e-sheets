<script lang="ts">
  import type { ActorSheetContext } from 'src/types/types';
  import { submitText } from './form';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
    import Tidy5eActorHitPointsConfig from 'src/dialogs/Tidy5eActorHitPointsConfig';

  export let context: ActorSheetContext;

  const localize = FoundryAdapter.localize;
</script>

<div class="profile-temp">
  <input
    on:change|stopPropagation|preventDefault={(event) =>
      submitText(event, context.actor, 'system.attributes.hp.temp')}
    type="number"
    class="temphp"
    placeholder="+{localize('DND5E.Temp')}"
    value={context.hp.temp || ''}
    title={localize('DND5E.HitPointsTemp')}
    data-dtype="Number"
    maxlength="5"
  />

  <input
    on:change|stopPropagation|preventDefault={(event) =>
      submitText(event, context.actor, 'system.attributes.hp.tempmax')}
    type="number"
    class="max-temphp"
    placeholder="+{localize('DND5E.Max')}"
    value={context.hp.tempmax || ''}
    title={localize('DND5E.HitPointsTempMax')}
    data-dtype="Number"
    maxlength="5"
  />
  {#if context.allowHpConfigOverride}
    <a
      data-tooltip={localize('DND5E.HitPointsConfig')}
      on:click|stopPropagation|preventDefault={(event) =>
        new Tidy5eActorHitPointsConfig(context.actor).render(
          true
        )}
    >
      <i class="fas fa-cog" />
    </a>
  {:else}
    <a
      data-tooltip={localize('DND5E.HitPointsConfig')}
      on:click|stopPropagation|preventDefault={(event) =>
        new dnd5e.applications.actor.ActorHitPointsConfig(context.actor).render(
          true
        )}
    >
      <i class="fas fa-cog" />
    </a>
  {/if}
</div>

<style lang="scss">
  .profile-temp {
    display: flex;
    justify-content: center;
  }

  .profile-temp input {
    flex: 0 0 2.1875rem; // Or hard width
    display: flex;
    font-size: 0.75rem;
    line-height: 0.75rem;
    height: 0.875rem;
    padding: 0.0625rem 0;
  }

  input.temphp {
    text-align: center;
  }

  input.max-temphp {
    text-align: center;
  }
</style>
