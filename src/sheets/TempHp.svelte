<script lang="ts">
  import type { ActorSheetContext } from 'src/types/types';
  import { submitText } from './form';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Tidy5eActorHitPointsConfig from 'src/dialogs/Tidy5eActorHitPointsConfig';
  import { SettingsProvider } from 'src/settings/settings';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import TextInput from 'src/components/form/TextInput.svelte';
  import NumberInput from 'src/components/form/NumberInput.svelte';

  let store = getContext<Readable<ActorSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<div class="profile-temp">
  <NumberInput
    document={$store.actor}
    field="system.attributes.hp.temp"
    cssClass="temphp"
    placeholder="+{localize('DND5E.Temp')}"
    value={$store.hp.temp || null}
    dataset={{ dtype: 'Number' }}
    maxlength={5}
    tooltip={localize('DND5E.HitPointsTemp')}
  />
  <NumberInput
    document={$store.actor}
    field="system.attributes.hp.tempmax"
    cssClass="max-temphp"
    placeholder="+{localize('DND5E.Max')}"
    value={$store.hp.tempmax || null}
    dataset={{ dtype: 'Number' }}
    maxlength={5}
    tooltip={localize('DND5E.HitPointsTempMax')}
  />
  {#if SettingsProvider.settings.allowHpConfigOverride.get()}
    <a
      data-tooltip={localize('DND5E.HitPointsConfig')}
      on:click|stopPropagation|preventDefault={(event) =>
        new Tidy5eActorHitPointsConfig($store.actor).render(true)}
    >
      <i class="fas fa-cog" />
    </a>
  {:else}
    <a
      data-tooltip={localize('DND5E.HitPointsConfig')}
      on:click|stopPropagation|preventDefault={(event) =>
        new dnd5e.applications.actor.ActorHitPointsConfig($store.actor).render(
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

    :global(input) {
      flex: 0 0 2.1875rem; // Or hard width
      display: flex;
      font-size: 0.75rem;
      line-height: 0.75rem;
      height: 0.875rem;
      padding: 0.0625rem 0;
    }

    :global(input.temphp) {
      text-align: center;
    }

    :global(input.max-temphp) {
      text-align: center;
    }
  }
</style>
